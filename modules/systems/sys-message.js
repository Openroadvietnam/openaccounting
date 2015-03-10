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
var model = require("../../models/message");
var User = require("../../models/user");
var Colleage = require("../../models/colleague");
var underscore = require("underscore");
var controller = require("../../controllers/controller");
module.exports = function(router){
	'use strict';
	var contr = new controller(router,model,'message',{
		require_id_app:false,
		sort:{date_created:1}
	});
	contr.route();
	contr.view = function(user,result,fn){
		result.joinModel(undefined,User,[{akey:'email_sender',bkey:'email',fields:[{name:'name_sender',value:'name'},{name:'picture_sender',value:'picture'}]},
										{akey:'email_receiver',bkey:'email',fields:[{name:'name_receiver',value:'name'},{name:'picture_receiver',value:'picture'}]}
								],function(kq){
			result.forEach(function(r){
				if(!r.picture_sender){
					r.picture_sender ='/images/avatar.jpg'
				}
				if(!r.name_sender){
					r.name_sender = r.email_sender;
				}
				if(!r.picture_receiver){
					r.picture_receiver ='/images/avatar.jpg'
				}
				if(!r.name_receiver){
					r.name_receiver = r.email_receiver;
				}
			});
			fn(null,result);
		});
		
	}
	contr.getting = function(user,id,next,obj){
		if(!(obj.email_owner==user.email)){
			return next(new Error("Not allow"));
		}
		if(!obj.read){
			model.findByIdAndUpdate(obj._id,{$set:{read:true}},function(error,obj){
				if(error){
					return console.log(error);
				}
				
				alertMessage(user.email);
			});
		}
		next();
	}		
	contr.finding = function(user,condition,next){
			condition.$or = [{email_owner:user.email}];
			next(null,condition);
	}
		
	contr.creating = function(user,obj,next){
			obj.email_sender = user.email;
			obj.email_owner = user.email;
			obj.read = true;
			next(null,obj);
	}
	contr.created = function(user,obj,next){
			var obj_receiver =new model();
			obj_receiver.email_sender = obj.email_sender;
			obj_receiver.email_receiver = obj.email_receiver;
			obj_receiver.email_owner = obj.email_receiver;
			obj_receiver.content = obj.content;
			obj_receiver.save(function(error){
				if(error){
					return console.log(error);
				}
				model.sendMessage(obj_receiver);
				alertMessage( obj.email_receiver);
			});
			
			next(null,obj);
	}
	contr.updating = function(user,data,obj,next){
			return next(new Error("Not allowed"));
	}	
	contr.deleting = function(user,obj,next){
			next(null,obj);
	}
	contr.deleted = function(user,obj,next){
			next(null,obj);
	}
	
	contr.router.route(contr.route_name + "/colleague/latest").get(function(req,res,next){
		var condition = {email_receiver:req.user.email,read:false};
		model.find(condition).sort({date_created:-1}).lean().exec(function(error,results){
			if(error) return next(error);
			if(results){
				var messages = [];
				var senders ={};
				results.forEach(function(k){
					if(!senders[k.email_sender]){
						messages.push(k);
						senders[k.email_sender] = 1;
					}
				});
				//
				
				messages.joinModel(undefined,User,[{akey:'email_sender',bkey:'email',fields:[{name:'name_sender',value:'name'},{name:'picture_sender',value:'picture'}]},
										{akey:'email_receiver',bkey:'email',fields:[{name:'name_receiver',value:'name'},{name:'picture_receiver',value:'picture'}]}
								],function(kq){
					res.send(messages);
				});
			}else{
				res.send([]);
			}
		});
	});
	contr.router.route(contr.route_name + "/chat/:email_dt").get(function(req,res,next){
		var email_dt = req.params.email_dt;
		if(email_dt==req.user.email){
			return res.send([]);
		}
		var condition = {email_owner:req.user.email};
		condition.$or =[{email_receiver:email_dt},{email_sender:email_dt}];
		model.find(condition).sort({date_created:1}).exec(function(error,results){
			if(error) return next(error);
			if(results){
				var messages = [];
				results.forEach(function(r){
					if(r.read==false){
						r.set('read',true);
						r.save(function(error){
							if(error) return console(error);
							alertMessage(req.user.email);
						});
					}
					messages.push(r.toObject());
				});
				messages.joinModel(undefined,User,[{akey:'email_sender',bkey:'email',fields:[{name:'name_sender',value:'name'},{name:'picture_sender',value:'picture'}]},
										{akey:'email_receiver',bkey:'email',fields:[{name:'name_receiver',value:'name'},{name:'picture_receiver',value:'picture'}]}
								],function(kq){
								
					res.send(messages);
				});
				
			}else{
				res.send([]);
			}
		});
	});
	
	contr.router.route(contr.route_name + "/colleague/list").get(function(req,res,next){
		var condition ={};
		condition.$or = [{email_owner:req.user.email},{$and:[{email:req.user.email},{cancel:false}]}];
		//condition.latest_message_created = {$ne:undefined};
		if(req.query.email_receiver){
			condition.$or = [{email : {$regex:req.query.email_receiver,$options:'i'}},{email_ower : {$regex:req.query.email_receiver,$options:'i'}}];
		}
		Colleage.find(condition).sort({latest_message_created:-1}).lean().exec(function(error,colls){
			//console.log(colls);
			if(error) return next(error);
			if(colls){
				colls.joinModel(undefined,User,[{akey:'email_owner',bkey:'email',fields:[{name:'name_owner',value:'name'},{name:'picture_owner',value:'picture'}]},
										{akey:'email',bkey:'email',fields:[{name:'name',value:'name'},{name:'picture',value:'picture'}]}
								],function(kq){
								
					colls.forEach(function(coll){
						if(coll.email_owner==req.user.email){
							coll.email_coll = coll.email;
							coll.picture_coll = coll.picture;
							coll.name_coll = coll.name;
						}else{
							coll.email_coll = coll.email_owner;
							coll.picture_coll = coll.picture_owner;
							coll.name_coll = coll.name_owner;
						}
					});
					res.send(colls);
				});
			}else{
				res.send([]);
			}
		});
	});
}
