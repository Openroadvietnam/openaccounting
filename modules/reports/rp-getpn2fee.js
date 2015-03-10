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
var pn1 = require("../../models/pn1");
var dmvt = require("../../models/dmvt");
var async = require("async");
var underscore = require("underscore");
var arrayfuncs = require("../../libs/array-funcs");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"getpn2fee",function(req,callback){
		
		var condition = req.query;
		if( !condition.tu_ngay || !condition.den_ngay){
			return callback("Báo cáo này yêu cầu các tham số:tu_ngay,den_ngay");
		}
		async.parallel(
			{
				invoices:function(callback){
					var query ={};
					query.id_app = condition.id_app;
					query.ngay_ct ={$gte:condition.tu_ngay,$lte:condition.den_ngay};
					if(condition.ma_dvcs){
						query.ma_dvcs = condition.ma_dvcs;
					}
					if(condition.so_ct){
						query.so_ct = condition.so_ct;
					}
					
					pn1.find(query).lean().exec(function(error,results){
						if(error) return callback(error);
						callback(null,results);
					});
				}
			},
			function(error,results){
				if(error) return callback(error);
				var invoices = results.invoices;
				async.map(invoices,function(invoice,callback){
					var ds =[];
					for(var i=0;i<invoice.details.length;i++){
						var detail = invoice.details[i];
						detail.id_hd = invoice._id;
						detail.so_ct = invoice.so_ct;
						detail.ngay_ct = invoice.ngay_ct;
						detail.ma_ct =invoice.ma_ct;
						detail.tien_phi_nt = 0;
						detail.tien_phi = 0;
						detail.sel = false;
						ds.push(detail);
					}
					invoice.details = ds;
					invoice.sel = false;
					ds.joinModel(condition.id_app,dmvt,[{akey:'ma_vt',bkey:'ma_vt',fields:[{name:'ten_vt',value:'ten_vt'}
												
									]},
							],function(results){
						callback(null,invoice);
					});
					
				},
				function(error,results){
					if(error) return callback(error);
					callback(null,invoices);
				});
				
			}
		);
	});
}