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
var vsocai = require("../../models/vsocai");
var dmtk = require("../../models/account");
var dmkh = require("../../models/customer");
var dmkc = require("../../models/dmkc");
var arrayfuncs = require("../../libs/array-funcs");
var async = require("async");
var underscore = require("underscore");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"getdk4pkc",function(req,callback){
		var condition = req.query;
		if(!condition.thang || !condition.nam || !condition.id_app){
			return callback("Chức năng này yêu cầu tham số: thang,nam,id_app");
		}
		condition.thang = Number(condition.thang);
		var ngay_dau_thang = new Date(condition.nam,condition.thang,1);
		var ngay_cuoi_thang = new Date(condition.nam,condition.thang+1,0);
		var report =[];
		dmkc.find({status:true}).sort({stt:1}).lean().exec(function(error,kcs){
			if(error) return callback(error);
			async.mapSeries(kcs,function(kc,callback){
				var tk = kc.tk_chuyen;
				var query ={tk:tk,id_app:condition.id_app};
				if(condition.ma_dvcs){
					query.ma_dvcs = condition.ma_dvcs;
				}
				if(condition.id_ct){
					query.id_ct = {$ne:condition.id_ct};
				}
				query.ngay_ct = {$gte:ngay_dau_thang,$lte:ngay_cuoi_thang};
				vsocai.find(query).lean().exec(function(error,rs){
					if(error) return callback(error);
					report.forEach(function(r){
						if(r.tk_no.indexOf(tk)>=0){
							var no ={tk:r.tk_no,ps_no_nt:r.tien_nt,ps_no:r.tien,ps_co_nt:0,ps_co:0};
							underscore.extend(no,r);
							rs.push(no);
						}
						if(r.tk_co.indexOf(tk)>=0){
							var co ={tk:r.tk_co,ps_co_nt:r.tien_nt,ps_co:r.tien,ps_no_nt:0,ps_no:0};
							underscore.extend(co,r);
							rs.push(co);
						}
					});
					var groups = underscore.groupBy(rs,function(r){
						var key =tk;
						if(kc.kh_yn){
							key = key + r.ma_kh;
						}else{
							r.ma_kh ="";
						}
						return key;
					});
					
					var kqs =[];
					for(var keyg in groups){
						var group = groups[keyg];
						var tien_nt = group.csum("ps_no_nt") - group.csum("ps_co_nt");
						var tien = group.csum("ps_no") - group.csum("ps_co");
						var ma_kh =group[0].ma_kh;
						var kq ={ma_kh_no:ma_kh,ma_kh_co:ma_kh};
						if(kc.loai_kc=='1'){
							kq.tien_nt = tien_nt;
							kq.tien = tien;
							kq.tk_no = kc.tk_nhan;
							kq.tk_co = kc.tk_chuyen;
						}else{
							kq.tien_nt = -tien_nt;
							kq.tien = -tien;
							kq.tk_no = kc.tk_chuyen;
							kq.tk_co = kc.tk_nhan;
						}
						kqs.push(kq);
					}
					kqs.forEach(function(d){
						report.push(d);
					});
					callback(null,kqs);
				});
			},function(error,dks){
				if(error) return callback(error);
				report = underscore.filter(report,function(r){
					return r.tien_nt !=0 || r.tien !=0;
				});
				var line =0;
				report.forEach(function(r){
					r.line = line;
					line++;
				});
				async.parallel({
					details_tk:function(callback){
						report.joinModel(condition.id_app,dmtk,[{akey:'tk_no',bkey:'tk',fields:[{name:'ten_tk_no',value:'ten_tk'}]},
															{akey:'tk_co',bkey:'tk',fields:[{name:'ten_tk_co',value:'ten_tk'}]}],function(kq){
							callback();
						});
					},
					details_customer:function(callback){
						report.joinModel(condition.id_app,dmkh,[{akey:'ma_kh_no',bkey:'ma_kh',fields:[{name:'ten_kh_no',value:'ten_kh'}]},
																{akey:'ma_kh_co',bkey:'ma_kh',fields:[{name:'ten_kh_co',value:'ten_kh'}]}],function(kq){
							callback();
						});
					}
				},function(error,results){
					callback(null,report);
				});
				
				
			});
		});
	});
}