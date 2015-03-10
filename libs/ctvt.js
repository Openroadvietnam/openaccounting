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
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.tu_ngay || !condition.ma_vt || !condition.den_ngay || !condition.id_app ){
		fn("Lỗi: Báo cáo này yêu cầu các tham số: tu_ngay,den_ngay,ma_vt,id_app");
		return;
	}
	//lay dieu kien
	////don vi co so
	var ma_dvcs = condition.ma_dvcs;
	if(!ma_dvcs){ 
		ma_dvcs ="";
	}
	ma_dvcs ={$regex:ma_dvcs,$options:'i'};

	/////kho
	var ma_kho = condition.ma_kho; 
	if(!ma_kho){
		ma_kho ="";
	}
	ma_kho ={$regex:ma_kho,$options:'i'};
	////vat tu
	var ma_vt = condition.ma_vt; 
	/////dieu kien khac	
	var tu_ngay = condition.tu_ngay;
	var den_ngay = condition.den_ngay;
	var id_app = condition.id_app;
	
		
	async.parallel({
		//dau ky
		dn:function(callback){
			var query = {ngay:tu_ngay,id_app:id_app};
			if(condition.ma_kho){
				query.ma_kho = condition.ma_kho;
			}
			query.ma_vt = condition.ma_vt;
			dkvt(query,function(error,result){
				if(error) return callback(error);
				callback(null,result);
			});
			
		},
		//phat sinh trong ky
		ps:function(callback){
			var query = {id_app:id_app
						,ngay_ct:{$gte:tu_ngay,$lte:den_ngay}
						,ma_vt:ma_vt
						,ma_kho:ma_kho
						,ma_dvcs:ma_dvcs};
			sokho.find(query,function(error,pss){
				if(error){
					callback(error);
					return;
				}
				callback(null,pss);
				
			});
		}
	},function(error,results){
		if(error){
			fn(error);
			return;
		}
		var data = [];
		//phat sinh
		results.ps.forEach(function(r){
			r.sysorder = 5;
			r.bold = false;
			data.push(r);
		});
		async.parallel({
			ton_dau:function(callback){
				var ton_dau = results.dn.csum("ton00");
				callback(null,ton_dau);
			},
			du_dau:function(callback){
				var du_dau = results.dn.csum("du00");
				callback(null,du_dau);
			},
			sl_nhap:function(callback){
				var sl_nhap = results.ps.csum("sl_nhap");
				callback(null,sl_nhap);
			},
			tien_nhap:function(callback){
				var tien_nhap = results.ps.csum("tien_nhap");
				callback(null,tien_nhap);
			},
			sl_xuat:function(callback){
				var sl_xuat = results.ps.csum("sl_xuat");
				callback(null,sl_xuat);
			},
			tien_xuat:function(callback){
				var tien_xuat = results.ps.csum("tien_xuat");
				callback(null,tien_xuat);
			}
		},function(error,results){
			//dau ky
			data.push({
				sysorder:1,
				bold:true,
				dien_giai:"Tồn đầu kỳ",
				sl_nhap:results.ton_dau,
				tien_nhap:results.du_dau,
				sl_xuat:0,
				tien_xuat:0
			});
			//tong phat sinh
			data.push({
				sysorder:6,
				bold:true,
				dien_giai:"Cộng phát sinh trong kỳ",
				sl_nhap:results.sl_nhap,
				tien_nhap:results.tien_nhap,
				sl_xuat:results.sl_xuat,
				tien_xuat:results.tien_xuat
			});
			//cuoi ky
			data.push({
				sysorder:9,
				bold:true,
				dien_giai:"Tồn cuối kỳ",
				sl_nhap:results.ton_dau + results.sl_nhap - results.sl_xuat,
				tien_nhap:results.du_dau + results.tien_nhap - results.tien_xuat
			});
			//
			fn(null,data);
		});
	}
	);
}