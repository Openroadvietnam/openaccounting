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
var qts = require("../models/qts");
var sotinhkh = require("../models/sotinhkh");
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.id_ts || !condition.thang|| !condition.nam || !condition.id_app ){
		fn("Lỗi: Báo cáo này yêu cầu các tham số: id_ts,thang,nam,id_app");
		return;
	}
	//lay dieu kien
	////vat tu
	var id_ts = condition.id_ts; 
	/////dieu kien khac	
	var thang = condition.thang;
	var nam = condition.nam;
	var id_app = condition.id_app;
	var tinh_kh_theo_ngay = condition.tinh_kh_theo_ngay;
	var ngay_cuoi_thang = new Date(nam,thang,0);
	var ngay_dau_thang = new Date(nam,thang-1,1);
	qts.findOne({_id:id_ts}).lean().exec(function(error,ts){
		if(error) return fn(error);
		if(!ts){
			return fn("Tài sản này không tồn tại");
		}
		if(ts.so_ky_kh<=0){
			return fn(null,null);
		}
		//chua khau hao tai san nay
		if(ts.ngay_tinh_kh> ngay_cuoi_thang){
			return fn(null,null);
		}
		//
		if(ts.ngay_giam && !ts.ngay_thoi_kh){
			ts.ngay_thoi_kh = ts.ngay_giam;
		}
		//da thoi khau hao
		if(ts.ngay_thoi_kh && ts.ngay_thoi_kh < ngay_dau_thang){
			return fn(null,null);
		}
		//xac dinh lai ngay cuoi thang
		if(ts.ngay_thoi_kh && ts.ngay_thoi_kh < ngay_cuoi_thang){
			ngay_cuoi_thang = ts.ngay_thoi_kh;
		}
		//xac dinh lai ngay dau thang cho thang dau tien
		if(ts.ngay_kh.getMonth()*ts.ngay_kh.getFullYear()==ngay_dau_thang.getMonth()*ngay_dau_thang.getFullYear()){
			ngay_dau_thang = ts.ngay_kh;
		}
		//
		var so_ngay_of_thang = ngay_cuoi_thang.getDate();
		var so_ngay_kh = so_ngay_of_thang - ngay_dau_thang.getDate() + 1;
		//
		var where = "this.nam * this.thang<" + (nam * thang).toString();
		sotinhkh.find({id_ts:id_ts,id_app:id_app,$where:where}).lean().exec(function(error,stl){
			if(error) return fn(error);
			var gia_tri_da_kh = 0;
			var gia_tri_con_lai =0;
			var so_ky_da_kh = stl.length;
			if(so_ky_da_kh>0){
				gia_tri_da_kh = stl.csum("gia_tri_kh_ky");
				gia_tri_con_lai = ts.details.csum("gia_tri_con_lai") - gia_tri_da_kh;
				gia_tri_da_kh =ts.details.csum("gia_tri_da_kh") +   gia_tri_da_kh;
			}else{
				gia_tri_da_kh= ts.details.csum("gia_tri_da_kh");
				gia_tri_con_lai = ts.details.csum("gia_tri_con_lai");
				
			}
			var so_ky_kh_con_lai = ts.so_ky_kh - so_ky_da_kh;
			if(so_ky_kh_con_lai<0 || gia_tri_con_lai<=0) return fn(null,null);
			var nguyen_gia = ts.details.csum("nguyen_gia");
			var gia_tri_kh_ky = 0; 
			if(so_ky_kh_con_lai==0){
				gia_tri_kh_ky = gia_tri_con_lai;
			}else{
				if(ts.tinh_kh_gia_tri_con_lai){
					gia_tri_kh_ky = Math.round(gia_tri_con_lai/so_ky_kh_con_lai,0);
				}else{
					gia_tri_kh_ky = ts.details.csum("gia_tri_kh_ky");
				}
				//khau hao theo ngay
				if(tinh_kh_theo_ngay && so_ngay_of_thang !=so_ngay_kh){
					gia_tri_kh_ky = Math.round((gia_tri_kh_ky/so_ngay_of_thang) * so_ngay_kh,0);
				}
				//lam tron khau hao
				if(ts.lam_tron_kh<=0){
					ts.lam_tron_kh =1;
				}
				if(gia_tri_con_lai-gia_tri_kh_ky<=ts.lam_tron_kh){
					gia_tri_kh_ky = gia_tri_con_lai;
				}
			}
			//
			fn(null,{
				so_the_ts:ts.so_the_ts
				,nguyen_gia:nguyen_gia
				,gia_tri_da_kh:gia_tri_da_kh
				,gia_tri_con_lai:gia_tri_con_lai
				,gia_tri_kh_ky:gia_tri_kh_ky
				,id_ts:ts._id
				,ngay_dau_thang:ngay_dau_thang
				,ngay_cuoi_thang:ngay_cuoi_thang
				,so_ngay_kh:so_ngay_kh
				}
			);
		});
		
		
	});
	
}