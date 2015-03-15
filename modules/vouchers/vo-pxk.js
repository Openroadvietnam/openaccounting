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
var Sokho = require("../../models/sokho");
var Tdttco = require("../../models/tdttco");
var Tdttco_tt = require("../../models/tdttco_tt");
var Vatvao = require("../../models/vatvao");
var Vsocai = require("../../models/vsocai");
var socai = require("../../models/socai");
var dvcs = require("../../models/dvcs");
var dmvt = require("../../models/dmvt");
var dmcpmh = require("../../models/dmcpmh");
var account = require("../../models/account");
var dmdt = require("../../models/dmdt");
var customer = require("../../models/customer");
var model = require("../../models/pxk");
var controller = require("../../controllers/controller");
var valid_acc_cust = require("../../libs/validator-acc-cust");
var async = require("async");
var ma_ct ='PXK';
module.exports = function(router){
	this.contr = new controller(router,model,ma_ct.toLowerCase(),{
		sort:		{ngay_ct:-1,so_ct:1}
	});
	this.contr.route();
	//post data
	this.contr.post = function(obj){
		//post sokho
		var postsokho = new PostBook(obj,obj.details,Sokho,function(detail,callback){
			detail.nxt = 2;
			detail.he_so_qd =1;
			detail.sl_xuat_qd = detail.sl_xuat * detail.he_so_qd;
			callback(detail);
		});
		postsokho.run();
		//post socai detail
		var postsocai_detail = new PostSocai(obj,obj.details,function(detail,callback){
			detail.tk_no = detail.tk_du;
			detail.tk_co = detail.tk_vt;
			detail.tien_nt = detail.tien_xuat_nt;
			detail.tien = detail.tien_xuat;
			callback(detail);
		});
		postsocai_detail.run();
	}
	
	//valid
	var valid = function(user,obj,next){
		for(var i=0;i<obj.details.length;i++){
			var detail = obj.details[i];
			detail.line = i;
			if(obj.ma_nt=='VND'){
				detail.tien_xuat = detail.tien_xuat_nt;
			}
		}
		next(null,obj);
	}
	//creating
	this.contr.creating = function(user,obj,next){
		valid(user,obj,function(error){
			if(error) return next(error);
			next(null,obj);
		});
	}
	this.contr.updating = function(user,data,obj,next){ 
		valid(user,data,function(error){
			if(error) return next(error);
			next(null,data,obj); 
		});
		
	}
	//deleted 
	this.contr.deleted = function(user,obj,callback){
		id_app = user.current_id_app;
		//delete sokho
		Sokho.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted sokho of voucher " + obj.so_ct);
		});
		//delete vsocai
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
						r.t_sl = r.details.csum('sl_xuat');
						r.t_tien_xuat = r.details.csum('tien_xuat');
						r.t_tien_xuat_nt = r.details.csum('tien_xuat_nt');
						
					}
				});
				
				
				callback();
			},
			details_tk:function(callback){
				async.map(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,account,[{akey:'tk_vt',bkey:'tk',fields:[{name:'ten_tk_vt',value:'ten_tk'}]}
														,{akey:'tk_du',bkey:'tk',fields:[{name:'ten_tk_du',value:'ten_tk'}]}
															],function(kq){
							callback1();
						});
					},
					function(error){
						
						callback();
					}
				);
			},
			details_vt:function(callback){
				async.map(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,dmvt,[{akey:'ma_vt',bkey:'ma_vt',fields:[{name:'ten_vt',value:'ten_vt'}]}],function(kq){
							callback1();
						});
					},
					function(error){
						
						callback();
					}
				);
			},
			details_dt:function(callback){
				async.map(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,dmdt,[{akey:'ma_dt',bkey:'ma_dt',fields:[{name:'ten_dt',value:'ten_dt'}]}
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