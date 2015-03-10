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
var Tdttco = require("../../models/tdttco");
var Tdttco_tt = require("../../models/tdttco_tt");
var Vatvao = require("../../models/vatvao");
var Vsocai = require("../../models/vsocai");
var socai = require("../../models/socai");
var dvcs = require("../../models/dvcs");
var account = require("../../models/account");
var customer = require("../../models/customer");
var model = require("../../models/pn2");
var controller = require("../../controllers/controller");
var valid_acc_cust = require("../../libs/validator-acc-cust");
var async = require("async");
var ma_ct ='PN2';
module.exports = function(router){
	this.contr = new controller(router,model,ma_ct.toLowerCase(),{
		sort:		{ngay_ct:-1,so_ct:1}
	});
	this.contr.route();
	//post data
	this.contr.post = function(obj){
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
		//detail
		obj.details.forEach(function(d){
			var detail = d.toObject();
			if(!detail.ma_kh){
				detail.ma_kh = obj.ma_kh;
			}
			detail.tk_co = obj.tk_co;
			details_sc.push(detail);
		});
		var postsocai = new PostSocai(obj,details_sc);
		postsocai.run();
		//post tdttco
		account.findOne({tk:obj.tk_co},{tk_cn:1},function(error,tk){
			if(error) return console.log(error);
			if(tk && tk.tk_cn == true){
				if(obj.vatvaos.length>0){
					var posttdttco = new PostBook(obj,obj.vatvaos,Tdttco,function(vatvao,callback){
						vatvao.tk_co = obj.tk_co;
						vatvao.tien_nt = vatvao.t_tien_nt + vatvao.t_thue_nt;
						vatvao.tien = vatvao.t_tien + vatvao.t_thue;
						callback(vatvao);
					});
					posttdttco.run();
				}else{
					var d = [obj];
					var posttdttco = new PostBook(obj,d,Tdttco,function(obj,callback){
						obj.so_hd = obj.so_ct;
						obj.ngay_hd = obj.ngay_ct;
						obj.tien_nt = obj.t_tien_nt;
						obj.tien =  obj.t_tien;
						callback(obj);
					});
					posttdttco.run();
				}
			}else{
				Tdttco.remove({id_ct:obj._id},function(error){
					console.log(error);
				});
			}
			
		});
	}
	
	//valid
	var valid = function(user,obj,next){
		
			for(var i=0;i<obj.details.length;i++){
				var detail = obj.details[i];
				detail.line = i;
				if(obj.ma_nt=='VND'){
					detail.tien = detail.tien_nt;
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
		var query ={id_hd:obj._id};
		Tdttco_tt.find(query,function(error,results){
			if(error) return next(error);
			if(results && results.length>0){
				next("Lỗi: Không thể cập nhật chứng từ này do đã được thanh toán");
			}else{
				valid(user,data,function(error){
					if(error) return next(error);
					next(null,data,obj); 
				});
			}
		});
		
	}
	//deleting
	this.contr.deleting = function(user,obj,next){
		var query ={id_hd:obj._id};
		Tdttco_tt.find(query,function(error,results){
			if(error) return next(error);
			if(results && results.length>0){
				next("Lỗi: Không thể xóa chứng từ này do đã được thanh toán");
			}else{
				next(null,obj);
			}
		});
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
		//delete vatvao
		Vatvao.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted vatvao of voucher " + obj.so_ct);
		});
		//delete tdttco
		Tdttco.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted tdttco of voucher " + obj.so_ct);
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
						
						r.t_tien = r.details.csum('tien')
						r.t_tien_nt = r.details.csum('tien_nt')
						
						
						
					}
					if(r.vatvaos){
						r.t_thue_vao = r.vatvaos.csum('t_thue')
						r.t_thue_vao_nt = r.vatvaos.csum('t_thue_nt')
					}
				});
				
				
				callback();
			},
			details_tk:function(callback){
				async.each(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,account,[{akey:'tk_no',bkey:'tk',fields:[{name:'ten_tk_no',value:'ten_tk'}]}
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