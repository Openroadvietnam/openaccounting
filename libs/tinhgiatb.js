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
var dkvt = require("./dkvt");
var sokho = require("../models/sokho");
var dmvt = require("../models/dmvt");
var giatb = require("../models/giatb");
var tinhgiatb1vt = require("./tinhgiatb1vt");
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.tu_thang || !condition.den_thang || !condition.nam || !condition.id_app ){
		fn("Lỗi: Tính năng này yêu cầu các tham số: tu_thang,den_thang,nam,id_app");
		return;
	}
	condition.tu_thang = Number(condition.tu_thang);
	condition.den_thang = Number(condition.den_thang);
	//lay dieu kien
	var ma_kho = condition.ma_kho;	
	var tu_ngay = new Date(condition.nam,condition.tu_thang-1,1);
	var den_ngay = new Date(condition.nam,condition.den_thang,0);
	var id_app = condition.id_app;
	
	var query_dmvt ={id_app:id_app,gia_xuat:'1'};
	if(condition.ma_vt){
		query_dmvt.ma_vt = condition.ma_vt;
	}
	dmvt.find(query_dmvt).lean().exec(function(error,dmvts){
		async.map(dmvts,function(vt,callback){
			var query ={id_app:id_app,tu_ngay:tu_ngay,den_ngay:den_ngay,ma_vt:vt.ma_vt,ma_kho:ma_kho};
			tinhgiatb1vt(query,function(error,gia){
				if(error) return callback(error);
				gia.id_app = id_app;
				gia.ma_kho = ma_kho;
				gia.status = true;
				callback(null,gia);
			})
		},function(error,results){
			if(error) return fn(error);
			//hien ket qua
			var results = underscore.filter(results,function(r){
				return r.gia!=0 || r.tong_sl!=0 || r.tong_tien !=0;
			});
			results.joinModel(id_app,dmvt,[{akey:'ma_vt',bkey:'ma_vt',fields:[{name:'ten_vt',value:'ten_vt'}]}],function(kq){
				fn(null,results);
			});
			//cap nhat gia vao so sach
			var thangs =[];
			for(var t = condition.tu_thang;t<=condition.den_thang;t++){
				thangs.push(t);
			}
			async.map(thangs,function(t,callback){
				async.map(results,function(vt,callback){
					vt.thang = t;
					vt.nam = condition.nam;
					async.parallel({
						savetogiatb:function(callback){
							//save to giatb
							var query_delete ={id_app:id_app,ma_vt:vt.ma_vt};
							if(ma_kho){
								query_delete.ma_kho = ma_kho;
							}
							giatb.remove(query_delete,function(error){
								if(error) return callback(error);
								giatb.create(vt,function(error,result){
									if(error)  {
										console.log("Loi khi luu vao bang gia trung binh thang vat tu " + vt.ma_vt);
										console.log(error);
										return callback(error);
									}
									callback(null,result);
								});
							});
							
						}
					},function(error,rs){
						if(error) return callback(error);
						callback(null);
					});
				},function(error){
					if(error) return callback(error);
					callback(null);
				});
			},function(error){
				//console.log("Da cap nhat gia trung binh vao bang gia trung binh");
			});
			//cap nhat so sach
			var vouchers_x ={};
			var vouchers_n ={};
			var ma_vts =[]
			results.forEach(function(vt){
				ma_vts.push(vt.ma_vt)
			});
			async.parallel({
				xuat:function(callback){
					//get phieu xuat
					var query_sokho_x ={id_app:id_app,ngay_ct:{$gte:tu_ngay,$lte:den_ngay},nxt:2,ma_vt:{$in:ma_vts},px_gia_dd:false};
					if(ma_kho){
						query_sokho_x.ma_kho = ma_kho;
					}
					sokho.find(query_sokho_x,function(error,sks){
						if(error) return callback(error);
						if(!sks || sks.length==0){
							return callback(null,vouchers_x);
						}
						async.map(sks,function(sk,callback){
							var voucher = vouchers_x[sk.id_ct];
							if(!voucher){
								var ct = require("../models/" + sk.ma_ct.toLowerCase());
								ct.findOne({_id:sk.id_ct},function(error,v){
									if(error) return callback(error);
									if(v){
										voucher = v;
										vouchers_x[sk.id_ct] = voucher;
									}else{
										console.log("Not found " + sk.id_ct);
									}
									callback();
								});
							}else{
								callback();
							}
							
						},function(error){
							if(error) {
								console.log("co loi lay phieu xuat");
								return callback(error);
							}
							callback(null,vouchers_x);
						});
						
					});
				},
				nhap:function(callback){
					//get phieu nhap gia tb
					var query_sokho_n ={id_app:id_app,ngay_ct:{$gte:tu_ngay,$lte:den_ngay},nxt:1,ma_vt:{$in:ma_vts},pn_gia_tb:true,ma_ct:{$ne:'PXC'}};
					if(ma_kho){
						query_sokho_n.ma_kho = ma_kho;
					}
					sokho.find(query_sokho_n,function(error,sks){
						
						if(error) return callback(error);
						if(!sks || sks.length==0){
							return callback(null,vouchers_n);
						}
						async.map(sks,function(sk,callback){
							var voucher = vouchers_n[sk.id_ct];
							if(!voucher){
								var ct = require("../models/" + sk.ma_ct.toLowerCase());
								ct.findOne({_id:sk.id_ct},function(error,v){
									if(error) return callback(error);
									if(v){
										voucher = v;
										vouchers_n[sk.id_ct] = voucher;
									}else{
										console.log("Not found " + sk.id_ct);
									}
									callback();
								});
							}else{
								callback();
							}
							
						},function(error){
							if(error) {
								console.log("co loi lay phieu nhap");
								return callback(error);
							}
							callback(null,vouchers_n);
						});
					});
				}
			}
			,function(error,kq){
				if(error) return console.error(error);
				//console.log("Da lay cac chung tu can ap gia xuat");
				//update gia xuat cho cac phieu xuat
				async.each(underscore.values(vouchers_x),function(voucher_x,callback){
					voucher_x.details.forEach(function(d){
						results.forEach(function(vt){
							if(d.ma_vt == vt.ma_vt && !d.px_gia_dd && (!ma_kho || ma_kho==d.ma_kho)){
								d.gia_von_nt = vt.gia;
								d.gia_von = vt.gia;
								d.tien_xuat_nt = d.sl_xuat * vt.gia;
								d.tien_xuat = Math.round( d.tien_xuat_nt,0);
							}
						});
					});
					voucher_x.save(function(error){
						if(error) return callback(error);
						//post lai so sach
						var ctrl = ctrlVouchers[voucher_x.ma_ct.toUpperCase()];
						if(ctrl && ctrl.contr.post){
							ctrl.contr.post(voucher_x);
						}
						callback(null);
					});
				},function(error){
					//console.log("Da ap gia xuat cho cac phieu xuat");
				});
				
				//update gia nhap cho cac phieu nhap gia trung binh
				async.each(underscore.values(vouchers_n),function(voucher_n,callback){
					voucher_n.details.forEach(function(d){
						results.forEach(function(vt){
							if(d.ma_vt == vt.ma_vt &&  d.pn_gia_tb && (!ma_kho || ma_kho==d.ma_kho)){
								d.gia_von_nt = vt.gia;
								d.gia_von = vt.gia;
								d.tien_nhap_nt = d.sl_nhap * vt.gia;
								d.tien_nhap = Math.round( d.tien_nhap_nt,0);
							}
						});
					});
					voucher_n.save(function(error){
						if(error) return callback(error);
						//post lai so sach
						var ctrl = ctrlVouchers[voucher_n.ma_ct.toUpperCase()];
						if(ctrl && ctrl.contr.post){
							//console.log("Phieu nhap " + voucher_n.ma_ct);
							ctrl.contr.post(voucher_n);
						}
						callback(null);
					});
				},function(error){
					//console.log("Da ap gia xuat cho cac phieu nhap gia trung binh");
				});
			});
		
			
			
		});
	});
		
	
}