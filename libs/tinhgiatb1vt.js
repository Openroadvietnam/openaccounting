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
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.ma_vt|| !condition.tu_ngay || !condition.den_ngay || !condition.id_app ){
		fn("Lỗi: Báo cáo này yêu cầu các tham số: tu_ngay,den_ngay,id_app,ma_vt");
		return;
	}
	//lay dieu kien
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
				var ton_dau = result.csum("ton00");
				var du_dau = result.csum("du00");
				callback(null,{ton_dau:ton_dau,du_dau:du_dau});
			});
			
		},
		//phat sinh trong ky
		ps:function(callback){
			var query = {id_app:id_app,pn_gia_tb:false
						,ngay_ct:{$gte:tu_ngay,$lt:den_ngay}
						,ma_vt:ma_vt
						,ma_kho:ma_kho};
			sokho.find(query).lean().exec(function(error,pss){
				if(error){
					callback(error);
					return;
				}
				var sl_nhap = pss.csum("sl_nhap");
				var tien_nhap = pss.csum("tien_nhap");
				callback(null,{sl_nhap:sl_nhap,tien_nhap:tien_nhap});
			});
		}
	},function(error,results){
		if(error){
			fn(error);
			return;
		}
		var tong_sl = results.ps.sl_nhap + results.dn.ton_dau;
		var tong_tien = results.ps.tien_nhap + results.dn.du_dau;
		if(tong_sl==0)
			gia =0;
		else 
			gia = Math.round(tong_tien/tong_sl,0);
		return fn(null,{ma_vt:ma_vt
			,ton_dau:results.dn.ton_dau,du_dau:results.dn.du_dau
			,sl_nhap:results.ps.sl_nhap,tien_nhap:results.ps.tien_nhap
			,tong_sl:tong_sl,tong_tien:tong_tien
			,gia:gia
			});
	}
	);
}