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
var options = require("../../models/options");
var PostSocai = require("../../libs/post-socai");
var counter = require("../../models/counter");
var arrayfuncs = require("../../libs/array-funcs");
var Sokho = require("../../models/sokho");
var Vsocai = require("../../models/vsocai");
var socai = require("../../models/socai");
var dvcs = require("../../models/dvcs");
var dmkho = require("../../models/dmkho");
var dmvt = require("../../models/dmvt");
var account = require("../../models/account");
var customer = require("../../models/customer");
var model = require("../../models/pbl");
var controller = require("../../controllers/controller");
var valid_acc_cust = require("../../libs/validator-acc-cust");
var async = require("async");
var ma_ct ='PBL';
module.exports = function(router){
	this.contr = new controller(router,model,ma_ct.toLowerCase(),{
		sort:		{ngay_ct:-1,so_ct:1}
	});
	this.contr.route();
	//post data
	this.contr.post = function(obj){
		obj.t_tien = obj.details.csum('tien_hang');
		obj.t_tien_nt = obj.details.csum('tien_hang_t');
		
		obj.t_ck = obj.details.csum('tien_ck') + obj.tien_ck_hd;
		obj.t_ck_nt = obj.details.csum('tien_ck_nt') + obj.tien_ck_hd;
		
		obj.t_tt = obj.t_tien  - obj.t_ck;
		obj.t_tt_nt = obj.t_tien_nt  - obj.t_ck_nt;
		//post sokho
		var postsokho = new PostBook(obj,obj.details,Sokho,function(detail,callback){
			detail.nxt = 2;
			detail.he_so_qd =1;
			detail.sl_xuat_qd = detail.sl_xuat * detail.he_so_qd;
			callback(detail);
		});
		postsokho.run();
		//post socai
		options.findOne({id_app:obj.id_app,id_func:ma_ct.toLowerCase()}).lean().exec(function(error,rs){
			var option
			if(!rs){
				option ={tk_tien:'1111',tk_cn:'331111',tk_dt:'51111',tk_ck:'5211',tk_gv:'6321'}
			}else{
				option = rs.option
			}
			var details =[];
			//doanh thu
			obj.details.forEach(function(d){
				var detail = d.toObject();
				detail.tk_co = option.tk_dt;
				if(!detail.ma_kh){
					detail.ma_kh = obj.ma_kh;
				}
				if(obj.tien_thu && obj.t_tt== obj.tien_thu){
					detail.tk_no = option.tk_tien; //thu het tien
				}else{
					detail.tk_no = option.tk_cn; //ghi nhan cong no neu khong thu tien hoac thu mot phan hoac thu nhieu hon
				}
				detail.tien_nt = detail.tien_nt;
				detail.tien = detail.tien;
				details.push(detail);
			});
			//thu tien mot phan
			
			if(obj.tien_thu && obj.t_tt!= obj.tien_thu){
				var tt = {};
				tt.tk_no = option.tk_tien
				tt.tk_co = option.tk_cn
				tt.tien_nt = obj.tien_thu
				tt.tien = obj.tien_thu
				details.push(tt);
			}
			//chiet khau
			obj.details.forEach(function(d){
				var detail = d.toObject();
				detail.tk_no = option.tk_ck;
				if(!detail.ma_kh){
					detail.ma_kh = obj.ma_kh;
				}
				if(obj.tien_thu && obj.t_tt== obj.tien_thu){
					detail.tk_co = option.tk_tien; //thu het tien
				}else{
					detail.tk_co = option.tk_cn; //ghi nhan cong no neu khong thu tien hoac thu mot phan hoac thu nhieu hon
				}
				
				detail.tien_nt = detail.tien_ck_nt;
				detail.tien = detail.tien_ck;
				details.push(detail);
			});
			//gia von
			obj.details.forEach(function(d){
				var detail = d.toObject();
				detail.tk_no = option.tk_gv;
				if(!detail.ma_kh){
					detail.ma_kh = obj.ma_kh;
				}
				detail.tk_co = detail.tk_vt;
				detail.tien_nt = detail.tien_xuat_nt;
				detail.tien = detail.tien_xuat;
				details.push(detail);
			});
			var postsocai = new PostSocai(obj,details);
			postsocai.run();
		})
	}
	
	//valid
	var valid = function(user,obj,next){
			for(var i=0;i<obj.details.length;i++){
				var detail = obj.details[i];
				detail.line = i;
				if(obj.ma_nt=='VND'){
					detail.tien = detail.tien_nt;
					detail.tien_hang = detail.tien_hang_nt;
					detail.tien_ck = detail.tien_ck_nt;
					detail.gia_ban = detail.gia_ban_nt
				}
				if(!detail.ma_kho){
					detail.ma_kho = obj.ma_kho;
				}else{
					if(!obj.ma_kho){
						obj.ma_kho = detail.ma_kho;
					}
				}
				detail.tien_xuat = detail.tien_xuat_nt;
				
			}
		next(null,obj);
	}
	//creating
	this.contr.creating = function(user,obj,next){
		id_app = user.current_id_app;
		if(obj.so_ct){
			valid(user,obj,function(error){
				if(error) return next(error);
				next(null,obj);
			});
		}else{
			counter.getNextSequence(id_app,ma_ct,"so_ct",function(error,sequence){
				if(error) sequence = 0
				//
				obj.so_ct = sequence
				valid(user,obj,function(error){
					if(error) return next(error);
					next(null,obj);
				});
			});
		}
		
	}
	this.contr.updating = function(user,data,obj,next){ 
		var query ={id_hd:obj._id};
		valid(user,data,function(error){
			if(error) return next(error);
			next(null,data,obj); 
		});
		
	}
	//deleting
	this.contr.deleting = function(user,obj,next){
		var query ={id_hd:obj._id};
		next(null,obj);
	}
	//deleted 
	this.contr.deleted = function(user,obj,callback){
		id_app = user.current_id_app;
		//delete sokho
		Sokho.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted sokho of voucher " + obj.so_ct);
		});
		//delete socai
		socai.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted socai of voucher " + obj.so_ct);
		});
		//delete vsocai
		Vsocai.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted vsocai of voucher " + obj.so_ct);
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
			kh:function(callback){
				items.joinModel(id_app,customer,[{akey:'ma_kh',bkey:'ma_kh',fields:[{name:'ten_kh',value:'ten_kh'}]}],function(kq){
					callback();
				});
			},
			kho:function(callback){
				items.joinModel(id_app,dmkho,[{akey:'ma_kho',bkey:'ma_kho',fields:[{name:'ten_kho',value:'ten_kho'}]}],function(kq){
					callback();
				});
			},
			t_tien:function(callback){
				items.forEach(function(r){
					if(r.details){
						r.t_sl = r.details.csum('sl_xuat');
						r.t_tien = r.details.csum('tien_hang');
						r.t_tien_nt = r.details.csum('tien_hang_t');
						
						r.t_ck = r.details.csum('tien_ck') + r.tien_ck_hd;
						r.t_ck_nt = r.details.csum('tien_ck_nt') + r.tien_ck_hd;
						
						r.t_tt = r.t_tien  - r.t_ck;
						r.t_tt_nt = r.t_tien_nt  - r.t_ck_nt;
					
						
						r.t_tien_xuat = r.details.csum('tien_xuat');
						r.t_tien_xuat_nt = r.details.csum('tien_xuat_nt');
						
					}

				});
				
				
				callback();
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