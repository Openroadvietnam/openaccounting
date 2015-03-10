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
var tdttco = require("../../models/tdttco");
var tdttco_tt = require("../../models/tdttco_tt");
var async = require("async");
var underscore = require("underscore");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"getinvoice2pay",function(req,callback){
		var condition = req.query;
		if(!condition.ma_kh || condition.ma_kh.trim()=="" || !condition.id_app){
			return callback("Chức năng này yêu cầu tham số: ma_kh,id_app");
		}
		async.parallel(
			{
				invoices:function(callback){
					var query = {};
					underscore.extend(query,condition);
					query.tat_toan = false;
					if(condition.ma_dvcs){
						query.ma_dvcs = condition.ma_dvcs;
					}
					delete query.access_token;
					tdttco.find(query,function(error,results){
						if(error) return callback(error);
						var invoices =[];
						for(var i=0;i<results.length;i++){
							var invoice = results[i].toObject();
							invoice.line = i;
							invoices.push(invoice);
						}
						
						callback(null,invoices);
					});
				}
			},
			function(error,results){
				if(error) return callback(error);
				var invoices = results.invoices;
				async.map(invoices,function(invoice,callback){
					var t_invoice ={sel:false,line:invoice.line,id_hd:invoice.id_ct,so_hd:invoice.so_hd,ngay_hd:invoice.ngay_hd,tien_hd_nt:invoice.tien_nt};
					t_invoice.ma_nt_hd = invoice.ma_nt;
					t_invoice.ty_gia_hd = invoice.ty_gia;
					t_invoice.ma_kh = invoice.ma_kh;
					t_invoice.dien_giai = invoice.dien_giai;
					t_invoice.tien_nt =0;
					t_invoice.tien =0;
					t_invoice.da_thanh_toan_nt =0;
					t_invoice.con_lai_nt =0;
					t_invoice.thanh_toan_qd =0;
					t_invoice.tk_no= invoice.tk_co;
					
					var query ={id_hd:invoice.id_ct,so_hd:invoice.so_hd};
					tdttco_tt.find(query,function(error,results){
						var da_thanh_toan_nt  = 0;
						for(var i=0;i<results.length;i++){
							da_thanh_toan_nt = da_thanh_toan_nt + results[i].thanh_toan_qd;
						}
						t_invoice.da_thanh_toan_nt = da_thanh_toan_nt;
						t_invoice.con_lai_nt = t_invoice.tien_hd_nt - t_invoice.da_thanh_toan_nt;
						
						callback(null,t_invoice);
					});
				},
				function(error,results){
					if(error) return callback(error);
					callback(null,results);
				});
				
			}
		);
	});
}