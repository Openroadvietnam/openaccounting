var colleague = require("../models/colleague");
var app = require("../models/app");
var User = require("../models/user");
var Notification = require("../models/notification");
var arrayFunctions = require("./array-funcs");
var async = require("async");
module.exports = function(email,fn){
	async.parallel({
		colls:function(callback){
			colleague.find({email:email,active:false,cancel:false},function(error,colls_raw){
				
				if(!error){
					var colls =[];
					colls_raw.forEach(function(c){
						colls.push(c.toObject());
					});
					colls.joinModel(undefined,User,[{akey:'email',bkey:'email',fields:[{name:'name_receiver',value:'name'},{name:'picture_receiver',value:'picture'}]}
									,{akey:'email_owner',bkey:'email',fields:[{name:'name_invitor',value:'name'},{name:'picture_invitor',value:'picture'}]}
								],function(kq){
						colls.forEach(function(c){
							if(!c.name_receiver) c.name = c.email;
							if(!c.name_invitor) c.name_invitor = c.email_owner;
							if(!c.picture_receiver) c.picture_receiver ='/modules/colleague/images/avatar.jpg';
							if(!c.picture_invitor) c.picture_invitor ='/modules/colleague/images/avatar.jpg';
						});
						callback(null,colls);
					});
					
				}else{
					callback(error);
				}
			});
		},
		notifications: function(callback){
			Notification.find({email_receiver:email,email_owner:email,read:false},function(error,colls_raw){
				
				if(!error){
					var colls =[];
					colls_raw.forEach(function(c){
						colls.push(c.toObject());
					});
					colls.joinModel(undefined,User,[{akey:'email_receiver',bkey:'email',fields:[{name:'name_receiver',value:'name'},{name:'picture_receiver',value:'picture'}]}
									,{akey:'email_sender',bkey:'email',fields:[{name:'name_sender',value:'name'},{name:'picture_sender',value:'picture'}]}
								],function(kq){
						colls.forEach(function(c){
							if(!c.name_receiver) c.name_receiver = c.email_receiver;
							if(!c.name_sender) c.name_sender = c.email_sender;
							if(!c.picture_receiver) c.picture_receiver ='/modules/colleague/images/avatar.jpg';
							if(!c.picture_sender) c.picture_sender ='/modules/colleague/images/avatar.jpg';
						});
						callback(null,colls);
					});
					
				}else{
					callback(error);
				}
			});
		},
		apps:function(callback){
			app.find({participants:{$elemMatch: {email:email,active:false,cancel:false}}},function(error,apps_raw){
				if(!error){
					var apps =[];
					apps_raw.forEach(function(c){
						apps.push(c.toObject());
					});
					var ps = [];
					async.each(apps,function(app,callback){
						app.participants.joinModel(undefined,User,[{akey:'email',bkey:'email',fields:[{name:'name_receiver',value:'name'},{name:'picture_receiver',value:'picture'}]}
											,{akey:'user_created',bkey:'email',fields:[{name:'name_invitor',value:'name'},{name:'picture_invitor',value:'picture'}]}
										],function(kq){
								app.participants.forEach(function(c){
									if(!c.name_receiver) c.name_receiver = c.email;
									if(!c.name_invitor) c.name_invitor = c.email_owner;
									if(!c.picture_receiver) c.picture_receiver ='/modules/colleague/images/avatar.jpg';
									if(!c.picture_invitor) c.picture_invitor ='/modules/colleague/images/avatar.jpg';
									c.company_name = app.name;
									c._id = app._id;
									ps.push(c);
								});
								callback(null);
							});
					},function(error){
						if(error) return callback(error)
						callback(null,ps);
					});
				}else{
					callback(error);
				}
			});
		}
	},function(error,rs){
		fn(error,rs);
	});
	
}