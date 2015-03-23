/*Copyright (C) 2015  Sao Tien Phong (http://saotienphong.com.vn)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var model = require("../../models/app");
var User = require("../../models/user");
var Notification = require("../../models/notification");
var underscore = require("underscore");
var async = require("async");
var usersAdmin = require("../../configs").admins;
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'app',{
		require_id_app:false,
		sort:{name:1}
	});
	contr.route();
	contr.view = function(user,items,fn){
		async.parallel({
			get_name:function(callback){
				async.each(items
					,function(item,callback){
						if(item.user_created==user.email){
							item.active = true;
						}
						if(item.participants){
							item.participants.joinModel(undefined,User,[{akey:'email',bkey:'email',fields:[{name:'name',value:'name'},{name:'picture',value:'picture'}]}],function(kq){
								kq.forEach(function(p){
									if(!p.picture){
										p.picture = "modules/colleague/images/avatar.jpg";
									}
									if(!p.name){
										p.name = p.email;
									}
									if(p.email==user.email){
										item.active = p.active;
									}
								});
								
								callback(null);
							});
						}else{
							callback(null);
						}
					}
					,function(error){
						callback(null);
					}
				);
			}
		},function(error,results){
			
			fn(null,items);
		});
	}
	contr.getting = function(user,id,next){
			model.find(
				{_id:id
				,$or:[{user_created:user.email},{participants:{$elemMatch:{email:user.email}}}]
				}
				,function(error,result){
					if(error) return next(error);
					if(result.length==0){
						return next("Not allowed");
					}else{
						return next();
					}
				}
			);
	}		
	contr.finding = function(user,condition,next){
		condition.$or = [
			{user_created : user.email},
			{participants:{$elemMatch:{email:user.email,cancel:false}}}
		];
		next(null,condition);
	}
		
	contr.creating = function(user,obj,next){
			if(!obj.ngay_dn){
				return next(new Error("ngay_dn required"));
			}
			obj.nam_bd = obj.ngay_dn.getFullYear();
			if(obj.participants){
				obj.participants.forEach(function(p){
						p.user_created = user.email;
					}
				)
			}
			next(null,obj);
		},
	contr.created = function(user,obj,next){
		async.each(obj.participants,function(p,callback){
			if(p.active || p.cancel){
				return callback();
			}
			var email = p.email;
			alertNotification(email);
			callback();
		},function(error){
		});
		//khoi tao database ban dau
		var initDatabase = require("../../libs/initDatabase");
		initDatabase.init(obj._id,function(error){
			if(error){
				console.log("Can't init database \n" + error);
				error="Rất lấy làm tiếc, Chương trình không thể khởi tạo dữ liệu ban đầu cho công ty này, tuy nhiên bạn vẫn có thể sử dụng chương trình";
			}
			next(error,obj);
		});
	}
		
	contr.updating = function(user,data,obj,next){
			if(user.email!=obj.user_created){
				return next("Bạn không có quyền cập nhật đối tượng này");
			}
		
			if(!data.ngay_dn){
				return next(new Error("ngay_dn required"));
			}
			data.nam_bd = new Date(data.ngay_dn).getFullYear();
			if(data.participants){
				data.participants.forEach(function(p){
						if(!p.user_created){
							p.user_created = user.email;
						}
						p.user_updated = user.email;
					}
				)
			}
			next(null,data,obj);
		}	
	contr.updated = function(user,obj,next){
		async.each(obj.participants,function(p,callback){
			if(p.active || p.cancel){
				return callback();
			}
			var email = p.email;
			alertNotification(email);
			callback();
		},function(error){
		});
		next(null,obj);
	}
	contr.deleting = function(user,obj,next){
			if(user.email!=obj.user_created){
				return next("Bạn không có quyền xóa đối tượng này");
			}
			next(null,obj);
		}
	contr.deleted = function(user,obj,next){
			next(null,obj);
		}
	contr.router.route(contr.route_name + "/apps/:email_owner").get(function(req,res,next){
		var email = req.params.email_owner;
		if(!underscore.contains(usersAdmin,req.user.email)){
			return res.status(403).send("Bạn không có quyền truy cập đối tượng này");
		}
		model.find({user_created:email}).lean().exec(function(error,apps){
			if(error) return res.status(400).send(error);
			res.send(apps);
		});
	});
	contr.router.route(contr.route_name + "/active/:id").get(function(req,res,next){
		var id = req.params.id;
		var email = req.user.email;
		model.findOne({_id:id,participants:{$elemMatch:{email:email,active:false,cancel:false}}},function(error,app){
			if(error) return res.status(400).send(error);
			app.participants.forEach(function(p){
				if(p.email==email){
					p.active = true;
				}
			});
			app.save(function(err){
				if(err) return res.status(400).send(err);
				Notification.createNotification(email,app.user_created,"Chấp nhận tham gia " + app.name,"đã chấp nhận tham gia " + app.name);
				res.send('ok');
			});
		});
	});
	contr.router.route(contr.route_name + "/notaccept/:id").get(function(req,res,next){
		var id = req.params.id;
		var email = req.user.email;
		model.findOne({_id:id,participants:{$elemMatch:{email:email}}},function(error,app){
			if(error) return res.status(400).send(error);
			app.participants.forEach(function(p){
				if(p.email==email){
					p.active = false;
					p.cancel = true;
				}
			});
			app.save(function(err){
				if(err) return res.status(400).send(err);
				Notification.createNotification(email,app.user_created,"Không chấp nhận tham gia " + app.name,"đã không chấp nhận tham gia " + app.name);
				res.send('ok');
			});
		});
	});
}
