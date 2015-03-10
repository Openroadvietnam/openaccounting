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
var account = require("../../models/account");
var customer = require("../../models/customer");
var model = require("../../models/hd3");
var controller = require("../../controllers/controller");
var valid_acc_cust = require("../../libs/validator-acc-cust");
var async = require("async");
var ma_ct ='HD3';
module.exports = function(router){
	this.contr = new controller(router,model,ma_ct.toLowerCase(),{
		sort:		{ngay_ct:-1,so_ct:1}
	});
	this.contr.route();
	//post data
	this.contr.post = function(obj){
		//post sokho
		var postsokho = new PostBook(obj,obj.details,Sokho,function(detail,callback){
			detail.nxt = 1;
			detail.he_so_qd =1;
			detail.sl_nhap_qd = detail.sl_nhap * detail.he_so_qd;
			detail.tk_co = obj.tk_co;
			callback(detail);
		});
		postsokho.run();
		//post vatvao
		var postvatvao = new PostBook(obj,obj.vatvaos,Vatvao);
		postvatvao.run();
		//post socai
		var details_sc =[];
		//vatvao
		obj.vatvaos.forEach(function(v){
			var vatvao = v.toObject();
			vatvao.tk_no = vatvao.tk_thue_no;
			vatvao.tk_co = vatvao.tk_du_thue;
			vatvao.tien_nt = vatvao.t_thue_nt;
			vatvao.tien = vatvao.t_thue;
			details_sc.push(vatvao);
		});
		//tra lai
		obj.details.forEach(function(d){
			var detail = d.toObject();
			detail.tk_no = detail.tk_tl;
			if(!detail.ma_kh){
				detail.ma_kh = obj.ma_kh;
			}
			detail.tk_co = obj.tk_co;
			detail.tien_nt = detail.tien_nt-detail.tien_ck_nt;
			detail.tien = detail.tien-detail.tien_ck;
			details_sc.push(detail);
		});
		//tien von
		obj.details.forEach(function(d){
			var detail = d.toObject();
			detail.tk_no = detail.tk_vt;
			if(!detail.ma_kh){
				detail.ma_kh = obj.ma_kh;
			}
			detail.tk_co = detail.tk_gv;
			detail.tien_nt = detail.tien_nhap_nt;
			detail.tien = detail.tien_nhap;
			details_sc.push(detail);
		});
		var postsocai = new PostSocai(obj,details_sc);
		postsocai.run();
		
	}
	
	//valid
	var valid = function(user,obj,next){
		
			for(var i=0;i<obj.details.length;i++){
				var detail = obj.details[i];
				detail.line = i;
				if(obj.ma_nt=='VND'){
					detail.tien = detail.tien_nt;
					detail.tien_ck = detail.tien_ck_nt;
					detail.tien_nhap = detail.tien_nhap_nt;
				}
				
			}
			for(var i=0;i<obj.vatvaos.length;i++){
				var vatvao = obj.vatvaos[i];
				vatvao.line = i;
				if(obj.ma_nt=='VND'){
					vatvao.t_thue = vatvao.t_thue_nt;
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
		//delete vatvao
		Vatvao.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted vatvao of voucher " + obj.so_ct);
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
			tk:function(callback){
				items.joinModel(id_app,account,[{akey:'tk_co',bkey:'tk',fields:[{name:'ten_tk_co',value:'ten_tk'}]}],function(kq){
					callback();
				});
			},
			kh:function(callback){
				items.joinModel(id_app,customer,[{akey:'ma_kh',bkey:'ma_kh',fields:[{name:'ten_kh',value:'ten_kh'}]}],function(kq){
					callback();
				});
			},
			t_tien:function(callback){
				items.forEach(function(r){
					if(r.details){
						r.t_sl = r.details.csum('sl_nhap');
						r.t_tien = r.details.csum('tien');
						r.t_tien_nt = r.details.csum('tien_nt');
						
						r.t_ck = r.details.csum('tien_ck');
						r.t_ck_nt = r.details.csum('tien_ck_nt');
						
	
						
						r.t_tien_nhap = r.details.csum('tien_nhap');
						r.t_tien_nhap_nt = r.details.csum('tien_nhap_nt');
						
					}
					if(r.vatvaos){
						r.t_thue_vao = r.vatvaos.csum('t_thue');
						r.t_thue_vao_nt = r.vatvaos.csum('t_thue_nt');
					}

				});
				
				
				callback();
			},
			details_tk:function(callback){
				async.each(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,account,[{akey:'tk_vt',bkey:'tk',fields:[{name:'ten_tk_vt',value:'ten_tk'}]}
														,{akey:'tk_gv',bkey:'tk',fields:[{name:'ten_tk_gv',value:'ten_tk'}]}
														,{akey:'tk_tl',bkey:'tk',fields:[{name:'ten_tk_tl',value:'ten_tk'}]}
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
				async.each(
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
			}
		},function(error,results){
			
			fn(null,items);
		});
	}
}