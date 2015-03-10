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
var model = require("../../models/notification");
var User = require("../../models/user");
var underscore = require("underscore");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'notification',{
		require_id_app:false,
		sort:{date_created:-1}
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
				alertNotification(user.email);
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
				return console.log(error);
				alertNotification(obj.email_receiver);
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
}
