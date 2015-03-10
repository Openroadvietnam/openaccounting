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
var model = require("../../models/colleague");
var app = require("../../models/app");
var User = require("../../models/user");
var Notification = require("../../models/notification");
var emailer = require("../../libs/email");
var systemConfig = require("../../configs");
var loadTemplate = require("../../libs/load-template");
var underscore = require("underscore");
var async = require("async");
var controller = require("../../controllers/controller");
var validator = require('validator');
module.exports = function(router){
	var contr = new controller(router,model,'colleague',{
		require_id_app:false,
		unique:		['email_owner','email']
	});
	contr.route();
	contr.view = function(user,result,fn){
		result.joinModel(undefined,User,[{akey:'email',bkey:'email',fields:[{name:'name',value:'name'},{name:'picture',value:'picture'}]},
										{akey:'email_owner',bkey:'email',fields:[{name:'name_owner',value:'name'},{name:'picture_owner',value:'picture'}]}
									],function(kq){
			result.forEach(function(r){
				if(!r.picture){
					r.picture ='/images/avatar.jpg'
				}
				if(!r.name){
					r.name = r.email;
				}
				if(!r.picture_owner){
					r.picture_owner ='/images/avatar.jpg'
				}
				if(!r.name_owner){
					r.name_owner = r.email_owner;
				}
				r.user = user;
				if(r.email_owner==user.email){
					r.email_coll = r.email;
					r.picture_coll = r.picture;
					r.name_coll = r.name;
				}else{
					r.email_coll = r.email_owner;
					r.picture_coll = r.picture_owner;
					r.name_coll = r.name_owner;
				}
			});
			

					
			fn(null,result);
		});
		
	}
	contr.getting = function(user,id,next,obj){
		if(obj.email_owner != user.email){
			return next("Không được phép");
		}
		next();
	}		
	contr.finding = function(user,condition,next){
			if(condition.$or){
				condition.$and = [{$or:condition.$or},{$or:[{email_owner:user.email},{$and:[{email:user.email},{cancel:false}]}]}];
				delete condition.$or
			}else{
				condition.$or = [{email_owner:user.email},{$and:[{email:user.email},{cancel:false}]}];
			}
			next(null,condition);
	}
		
	contr.creating = function(user,obj,next){
			obj.email_owner = user.email;
			if(!validator.isEmail(obj.email)){
				return next("Lỗi: Email này không có giá trị");
			}
			next(null,obj);
	},
	contr.created = function(user,obj,next){
			alertNotification(obj.email);
			//send email
			var link  = systemConfig.domain;
			User.findOne({email:obj.email_owner},{name:1},function(error,u){
				if(u){
					loadTemplate("thu moi gia nhap nhom.html",{receiver_name:obj.email,sender_name:u.name},function(error,html){
						if(error) return console.log(error);
						if(html){
							emailer.sendHtml({to:{name:obj.email,address:obj.email},subject:"Thư mời tham gia nhóm làm việc",html:html},function(error,info){
								if(error) {
									console.error("Khong the gui email thon tin tai khoan cho nguoi dung\n" + error);
								}
							});
						}
					});
				}
			});
			
			next(null,obj);
		}	
	contr.deleting = function(user,obj,next){
			if(user.email!=obj.email_owner){
				return next("Không được phép");
			}
			next(null,obj);
		}
	contr.deleted = function(user,obj,next){
			app.find({user_created:user.email,participants:{$elemMatch:{email:obj.email}}},function(error,results){
				async.each(results,function(a,callback){
					var participants = underscore.reject(a.participants,function(p){
						return p.email == obj.email;
					});
					app.findByIdAndUpdate(a._id,{participants:participants},function(error,a){
						if(error) return callback(error);
						callback();
					});
				},function(error){
					if(error) return next(error);
					next(null,obj);
				})
			});
			
	}
	contr.router.route(contr.route_name + "/active/:id").get(function(req,res,next){
		var id = req.params.id;
		var email = req.user.email;
		model.findOne({_id:id,email:email,active:false,cancel:false},function(error,coll){
			if(error) return res.send(400,error);
			if(coll){
				coll.active = true;
				coll.save(function(err){
					if(err) return res.send(400,err);
					Notification.createNotification(email,coll.email_owner,"Chấp nhận gia nhập mạng của bạn","đã chấp nhận gia nhập mạng của bạn");
					res.send('ok');
				});
			}else{
				res.send(400,'Not found colleague ' + id);
			}
		});
	});
	contr.router.route(contr.route_name + "/notaccept/:id").get(function(req,res,next){
		var id = req.params.id;
		var email = req.user.email;
		model.findOne({_id:id,email:email},function(error,coll){
			if(error) return res.send(400,error);
			if(coll){
				coll.active = false;
				coll.cancel =true;
				coll.save(function(err){
					if(err) return res.send(400,err);
					Notification.createNotification(email,coll.email_owner,"Không chấp nhận gia nhập mạng của bạn","đã không chấp nhận gia nhập mạng của bạn");
					res.send('ok');
				});
			}else{
				res.send(400,'Not found colleague ' + id);
			}
		});
	});
}
