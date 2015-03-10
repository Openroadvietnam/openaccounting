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
var databanle = require("../../libs/databanle");
var async = require("async");
var underscore = require("underscore");
var arrayfuncs = require("../../libs/array-funcs");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"dtbanletheoquy",function(req,callback){
		var condition = req.query;
		if( !condition.nam ){
			return callback("Báo cáo này yêu cầu các tham số:nam");
		}
		var query ={id_app:condition.id_app};
		var tu_ngay = new Date(condition.nam,0,1)
		var den_ngay = new Date(condition.nam,11,31)
		query.ngay_ct ={$gte:tu_ngay,$lte:den_ngay};
		if(condition.ma_dvcs){
			query.ma_dvcs= {$regex:condition.ma_dvcs,$options:'i'}
		}
		
		databanle(query,function(error,rs){
			if(error) return callback(error);
			rs.forEach(function(r){
				r.thang = r.ngay_ct.getMonth() + 1;
				if(r.thang >=1 && r.thang<=3){
					r.quy =1;
				}
				if(r.thang >=4 && r.thang<=6){
					r.quy =2;
				}
				if(r.thang >=7 && r.thang<=9){
					r.quy =3;
				}
				if(r.thang >=10 && r.thang<=12){
					r.quy =4;
				}
			});
			async.map(rs,function(r,callback){
				r.t_so_luong = r.details.csum("sl_xuat");
				r.t_tien_hang = r.details.csum("tien");
				r.t_tien_ck = r.details.csum("tien_ck");
				r.t_tien_xuat = r.details.csum("tien_xuat");
				callback(null,r);
			},function(error,rs){
				if(error) return callback(error);
				rs.groupBy('quy',[{name:'t_so_luong',value:'t_so_luong'},{name:'t_tien_hang',value:'t_tien_hang'},{name:'t_tien_ck',value:'t_tien_ck'}
						,{name:'tien_ck_hd',value:'tien_ck_hd'},{name:'t_tien_xuat',value:'t_tien_xuat'}],function(error,rs){
					if(error) return callback(error);
					//sap xep
					var report = underscore.sortBy(rs,function(r){
						return r.quy;
					})
					var i=1;
					report.forEach(function(r){
						r.stt = i
						r.bold = false;
						r.t_doanh_thu = r.t_tien_hang - r.t_tien_ck - r.tien_ck_hd;
						r.t_lai = r.t_doanh_thu - r.t_tien_xuat;
						i++;
					});
					//dong tong cong
					report.push({
						quy:'Tổng cộng',
						t_so_luong:report.csum('t_so_luong'),
						t_tien_hang:report.csum('t_tien_hang'),
						t_tien_ck:report.csum('t_tien_ck'),
						tien_ck_hd:report.csum('tien_ck_hd'),
						t_tien_xuat:report.csum('t_tien_xuat'),
						t_doanh_thu:report.csum('t_doanh_thu'),
						t_lai:report.csum('t_lai'),
						bold:true
					});
					//ket qua
					callback(null,report);
				});
			});
		});
	});
}