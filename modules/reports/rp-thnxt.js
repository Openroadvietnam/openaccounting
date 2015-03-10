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
var thnxt = require("../../libs/thnxt");
var dmvt = require("../../models/dmvt");
var underscore = require("underscore");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"thnxt",function(req,callback){
	
		var query = req.query;
		if(!query.tu_ngay || !query.den_ngay){
			return callback("Báo cáo này yêu cầu các tham số: tu_ngay,den_ngay");
		}
		var id_app = query.id_app;
		thnxt(query,function(error,report){
			if(error) return callback(error);
			report.joinModel(id_app,dmvt,[
				{
					akey:'ma_vt',bkey:'ma_vt',
					fields:[
						{
							name:'ten_vt',
							value:'ten_vt'
						}
					]
				}
			],function(report){
				report.push({ma_vt:'',ten_vt:'Tổng cộng'
							,ton_dau:report.csum('ton_dau')
							,du_dau:report.csum('du_dau')
							
							,sl_nhap:report.csum('sl_nhap')
							,tien_nhap:report.csum('tien_nhap')
							
							,sl_xuat:report.csum('sl_xuat')
							,tien_xuat:report.csum('tien_xuat')
					
							,ton_cuoi:report.csum('ton_cuoi')
							,du_cuoi:report.csum('du_cuoi')
							,systotal:1,bold:true
					}
				);
				
				var report = underscore.sortBy(report,function(r){
					return r.ma_vt;
				});
				callback(null,report);
			});
		});
	});
}