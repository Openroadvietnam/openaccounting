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
var sokho = require("../../models/sokho");
var dmkh = require("../../models/customer");
var async = require("async");
var underscore = require("underscore");
var arrayfuncs = require("../../libs/array-funcs");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"dtbanletheokh",function(req,callback){
		var condition = req.query;
		if( !condition.tu_ngay || !condition.den_ngay){
			return callback("Báo cáo này yêu cầu các tham số:tu_ngay,den_ngay");
		}
		var query ={id_app:condition.id_app,ma_ct:{$in:['PBL','SO1']}};
		query.ngay_ct ={$gte:condition.tu_ngay,$lte:condition.den_ngay};
		if(condition.ma_dvcs){
			query.ma_dvcs= {$regex:condition.ma_dvcs,$options:'i'}
		}
		if(condition.ma_kh){
			query.ma_kh= {$regex:condition.ma_kh,$options:'i'}
		}
		
		
		sokho.find(query).lean().exec(function(error,rs){
			if(error)  {
				console.log(error);
				return callback(error);
			}
			
			rs.groupBy('ma_kh',[{name:'sl_xuat',value:'sl_xuat'},{name:'tien',value:'tien'},{name:'tien_ck',value:'tien_ck'}
						,{name:'tien_xuat',value:'tien_xuat'}],function(error,rs){
				if(error) {
					console.log(error);
					return callback(error);
				}
				//sap xep
				var report = underscore.sortBy(rs,function(r){
					return r.ma_kh;
				})
				var i=1;
				report.forEach(function(r){
					r.stt = i
					r.bold = false;
					r.doanh_thu = r.tien - r.tien_ck;
					r.lai = r.doanh_thu - r.tien_xuat;
					i++;
				});
				report.joinModel(condition.id_app,dmkh,[{akey:'ma_kh',bkey:'ma_kh',fields:[{name:'ten_kh',value:'ten_kh'},{name:'ma_dvt',value:'ma_dvt'}]}],function(rs){
					//dong tong cong
					report.push({
						ten_kh:'Tổng cộng',
						sl_xuat:report.csum('sl_xuat'),
						tien:report.csum('tien'),
						tien_ck:report.csum('tien_ck'),
						doanh_thu:report.csum('doanh_thu'),
						tien_xuat:report.csum('tien_xuat'),
						lai:report.csum('lai'),
						bold:true
					});
					//ket qua
					callback(null,report);
				});
				
			});
		});
	});
}