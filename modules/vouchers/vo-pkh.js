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
var PostBook = require("../../libs/post-book");
var PostSocai = require("../../libs/post-socai");
var arrayfuncs = require("../../libs/array-funcs");
var Vsocai = require("../../models/vsocai");
var socai = require("../../models/socai");
var dvcs = require("../../models/dvcs");
var qts = require("../../models/qts");
var dmbp = require("../../models/dmbp");
var account = require("../../models/account");
var customer = require("../../models/customer");
var model = require("../../models/pkh");
var controller = require("../../controllers/controller");
var valid_acc_cust = require("../../libs/validator-acc-cust");
var async = require("async");
var ma_ct ='PKH';
var valid_detail = function(user,obj,fn){
	var id_app = obj.id_app;
	for(var i=0;i<obj.details.length;i++){
		detail = obj.details[i];
		detail.line = i;
		if(obj.ma_nt =='VND'){
			detail.tien=detail.tien_nt;
		}
	}
	//valid account
	async.map(obj.details,function(detail,mapcallback){
		async.parallel([
			function(callback){
				valid_acc_cust.checkAccAndCust(id_app,detail.tk_no,detail.ma_kh_no,function(error){
					if(error) return callback(error);
					callback(null,true);
				});
			},
			function(callback){
				valid_acc_cust.checkAccAndCust(id_app,detail.tk_co,detail.ma_kh_co,function(error){
					if(error) return callback(error);
					callback(null,true);
				});
			}
		],function(e,r){
			if(e) return mapcallback(e);
			mapcallback(null,true);
		});
		
	},function(error,result){
		if(error) return fn(error);
		fn();
	});
}
module.exports = function(router){
	this.contr = new controller(router,model,ma_ct.toLowerCase(),{
		sort:		{ngay_ct:-1,so_ct:1}
	});
	this.contr.route();
	//post data
	this.contr.post = function(obj){
		//post socai
		var details_sc =[];
		//detail
		obj.details.forEach(function(d){
			details_sc.push(d.toObject());
		});
		var postsocai = new PostSocai(obj,details_sc);
		postsocai.run();
	}
	//deleted 
	this.contr.deleted = function(user,obj,callback){
		id_app = user.current_id_app;
		//delete socai
		Vsocai.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted socai of voucher " + obj.so_ct);
		});
		//delete socai
		socai.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted socai of voucher " + obj.so_ct);
		});
		callback(null,obj);
	}
	this.contr.creating= function(user,obj,next){
			id_app = user.current_id_app;
			//valid
			valid_detail(user,obj,function(error){
				if(error) return next(error);
				next(null,obj); 
			});
			
		}
	this.contr.updating = function(user,data,obj,next){ 
		id_app = user.current_id_app;
		//valid
		valid_detail(user,data,function(error){
			if(error) return next(error);
			next(null,data,obj); 
		});
	}
	this.contr.view = function(user,items,fn){
		id_app = user.current_id_app;
		async.parallel({
			dv:function(callback){
				items.joinModel(id_app,dvcs,[{akey:'ma_dvcs',bkey:'_id',fields:[{name:'ten_dvcs',value:'ten_dvcs'}]}],function(kq){
					callback();
				});
			},
			t_tien:function(callback){
				items.forEach(function(r){
					if(r.details){
						
						r.t_tien = r.details.csum('tien')
						r.t_tien_nt = r.details.csum('tien_nt')
						
					}
				});
				
				
				callback();
			},
			details_tk:function(callback){
				async.each(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,account,[{akey:'tk_no',bkey:'tk',fields:[{name:'ten_tk_no',value:'ten_tk'}]},
															{akey:'tk_co',bkey:'tk',fields:[{name:'ten_tk_co',value:'ten_tk'}]}],function(kq){
							callback1();
						});
					},
					function(error){
						
						callback();
					}
				);
			},
			details_ts:function(callback){
				async.each(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,qts,[{akey:'id_ts',bkey:'_id',fields:[{name:'ten_ts',value:'ten_ts'}]}
									],function(kq){
							callback1();
						});
					},
					function(error){
						
						callback();
					}
				);
			}
			,
			details_bp:function(callback){
				async.each(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,dmbp,[{akey:'ma_bp',bkey:'ma_bp',fields:[{name:'ten_bp',value:'ten_bp'}]}
									],function(kq){
							callback1();
						});
					},
					function(error){
						
						callback();
					}
				);
			}
		},function(error,results){
			
			fn(null,items);
		});
	}
}