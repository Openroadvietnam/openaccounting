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
var Tdttno = require("../../models/tdttno");
var Tdttno_tt = require("../../models/tdttno_tt");
var Vatra = require("../../models/vatra");
var Vsocai = require("../../models/vsocai");
var socai = require("../../models/socai");
var dvcs = require("../../models/dvcs");
var dmvt = require("../../models/dmvt");
var account = require("../../models/account");
var customer = require("../../models/customer");
var model = require("../../models/hd2");
var controller = require("../../controllers/controller");
var valid_acc_cust = require("../../libs/validator-acc-cust");
var async = require("async");
var ma_ct ='HD2';
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
			detail.tk_no = obj.tk_no;
			callback(detail);
		});
		postsokho.run();
		//post socai
		var details = [];
		//doanh thu
		obj.details.forEach(function(d){
			var detail = d.toObject();
			detail.tk_co = detail.tk_dt;
			if(!detail.ma_kh){
				detail.ma_kh = obj.ma_kh;
			}
			detail.tk_no = obj.tk_no;
			detail.tien_nt = detail.tien_nt;
			detail.tien = detail.tien;
			details.push(detail);
		});
		//chiet khau
		obj.details.forEach(function(d){
			var detail = d.toObject();
			detail.tk_no = detail.tk_ck;
			if(!detail.ma_kh){
				detail.ma_kh = obj.ma_kh;
			}
			detail.tk_co = obj.tk_no;
			detail.tien_nt = detail.tien_ck_nt;
			detail.tien = detail.tien_ck;
			details.push(detail);
		});
		//gia von
		obj.details.forEach(function(d){
			var detail = d.toObject();
			detail.tk_no = detail.tk_gv;
			if(!detail.ma_kh){
				detail.ma_kh = obj.ma_kh;
			}
			detail.tk_co = detail.tk_vt;
			detail.tien_nt = detail.tien_xuat_nt;
			detail.tien = detail.tien_xuat;
			details.push(detail);
		});
		//thue
		var o =obj.toObject();
		o.tk_no = obj.tk_no;
		o.tk_co = obj.tk_thue_co;
		o.tien_nt = obj.t_thue_nt;
		o.tien = obj.t_thue;
		details.push(o);
		var postsocai = new PostSocai(obj,details);
		postsocai.run();
		//post tdttno
		account.findOne({tk:obj.tk_no},{tk_cn:1},function(error,tk){
			if(error) return console.log(error);
			if(tk && tk.tk_cn == true){
				var d = [obj];
				var posttdttno = new PostBook(obj,d,Tdttno,function(obj,callback){
					if(!obj.so_hd ){
						obj.so_hd = obj.so_ct;
					}
					if(!obj.ngay_hd){
						obj.ngay_hd = obj.ngay_ct;
					}
					obj.tien_nt = obj.details.csum('tien_nt') - obj.details.csum('tien_ck_nt') + obj.t_thue_nt;
					obj.tien =  obj.details.csum('tien') - obj.details.csum('tien_ck') + obj.t_thue;
					callback(obj);
				});
				posttdttno.run();
			}else{
				Tdttno.remove({id_ct:obj._id},function(error){
					if(error) console.log(error);
				});
			}
			
		});
		//post vatra
		if(obj.so_hd && obj.ngay_hd && obj.thue_suat && obj.so_seri){
			var d = [obj];
			var postvatra = new PostBook(obj,d,Vatra,function(obj,callback){
				obj.tk_du_thue = obj.tk_no;
				if(!obj.ten_vt){
					obj.ten_vt = obj.dien_giai;
				}
				callback(obj);
			});
			postvatra.run();
		}else{
			Vatra.remove({id_ct:obj._id},function(error){
				if(error){
					return console.log(error);
				}
			});
		}
	}
	
	//valid
	var valid = function(user,obj,next){
		
			for(var i=0;i<obj.details.length;i++){
				var detail = obj.details[i];
				detail.line = i;
				if(obj.ma_nt=='VND'){
					detail.tien = detail.tien_nt;
					detail.tien_ck = detail.tien_ck_nt;
				}
				detail.tien_xuat = detail.tien_xuat_nt;
				
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
		Tdttno_tt.find(query,function(error,results){
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
		Tdttno_tt.find(query,function(error,results){
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
		//delete sokho
		Sokho.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted sokho of voucher " + obj.so_ct);
		});
		//delete vsocai
		Vsocai.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted vsocai of voucher " + obj.so_ct);
		});
		//delete socai
		socai.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted socai of voucher " + obj.so_ct);
		});
		//delete vatra
		Vatra.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted Vatra of voucher " + obj.so_ct);
		});
		//delete tdttno
		Tdttno.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted tdttno of voucher " + obj.so_ct);
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
				items.joinModel(id_app,account,[{akey:'tk_no',bkey:'tk',fields:[{name:'ten_tk_no',value:'ten_tk'}]}],function(kq){
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
						r.t_sl = r.details.csum('sl_xuat');
						r.t_tien = r.details.csum('tien');
						r.t_tien_nt = r.details.csum('tien_t');
						
						r.t_ck = r.details.csum('tien_ck');
						r.t_ck_nt = r.details.csum('tien_ck_nt');
						
					
						
						r.t_tien_xuat = r.details.csum('tien_xuat');
						r.t_tien_xuat_nt = r.details.csum('tien_xuat_nt');
						
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
												,{akey:'tk_dt',bkey:'tk',fields:[{name:'ten_tk_dt',value:'ten_tk'}]}
												,{akey:'tk_ck',bkey:'tk',fields:[{name:'ten_tk_ck',value:'ten_tk'}]}
												,{akey:'tk_gv',bkey:'tk',fields:[{name:'ten_tk_gv',value:'ten_tk'}]}
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