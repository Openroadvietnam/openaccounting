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
var vatvao = require("../../models/vatvao");
var vatra = require("../../models/vatra");
var arrayfuncs = require("../../libs/array-funcs");
var kbmtkgtgt = require("../../models/kbm_tkgtgt");
var async = require("async");
var underscore = require("underscore");
var controller = require("../../controllers/controllerRPT");
var getRegString = function(arrayTk){
	if(!arrayTk) return null;
	var tk;
	arrayTk.forEach(function(t){
		if(t!=""){
			if(!tk){
				tk = "^" + t;
			}else{
				tk = tk + "|" + "^" + t;
			}
		}
	});
	return tk;
}
var calc = function(report,r,field,fn){
	var calculated = false;
	async.each(report,function(rlq,c6){
		var ct_field = "cong_thuc_" + field;
		if(rlq[ct_field]){
			try{
				var ma_so = "[" + r.ma_so + ']';
				if(rlq[ct_field].indexOf(ma_so)>=0){
					rlq[ct_field] = rlq[ct_field].replace(ma_so,r[field]);
					if(rlq[ct_field].indexOf("[")<0){
						rlq[field] = eval("(" + rlq[ct_field] + ")"); 
						rlq[ct_field] = null;
					}
					calculated = true;
				}
			}catch(e){
				return c6(e);
			}
		}
		c6();
	},function(error){
		if(error){
			console.log(error);
		}
		fn(error,calculated);
	});
}
module.exports = function(router){
	var rpt = new controller(router,"tkgtgt",function(req,callback){
		var query = req.query;
		if(!query.tu_thang || !query.den_thang || !query.nam){
			return callback("Báo cáo này yêu cầu các tham số: tu_thang, den_thang, nam");
		}
		if(!query.ma_dvcs){
			query.ma_dvcs ="";
		}
		
		var tu_ngay = new Date(query.nam,Number(query.tu_thang)-1,1);
		var den_ngay = new Date(query.nam,Number(query.den_thang),0);
		var report;
		kbmtkgtgt.find({id_app:query.id_app}).exec(function(error,kbm){
			if(error){
				return callback(error);
			}
			report = kbm;
			kbm.forEach(function(r){
				if(r.cong_thuc){
					if(r.phan_loai=='3' || r.phan_loai=='1'){
						r.cong_thuc_t_tien = r.cong_thuc;
					}
					if(r.phan_loai=='2' || r.phan_loai=='1'){
						r.cong_thuc_t_thue = r.cong_thuc;
					}
					
				}
			});
			async.map(report,function(r,callback){
				//tinh theo ma so
				if(r.cach_tinh=='1' || r.phan_loai=='4'){
					callback(null,r);
				}else{
					//tinh theo so phat sinh trong ky
					var condition = {
						ngay_ct:{$gte:tu_ngay,$lte:den_ngay},
						ma_dvcs:{$regex:'^' + query.ma_dvcs,$options:'i'},
						id_app:query.id_app
					};
					if(r.ma_thue && r.ma_thue.length>0){
						if(!(r.ma_thue.length==1 && r.ma_thue[0]=='')){
							condition.ma_thue = {$in:r.ma_thue};
						}
						
					}		
					if(r.bang_du_lieu.toLowerCase()=="vatvao"){
						if(r.ma_tc && r.ma_tc.length>0){
							if(!(r.ma_tc.length==1 && r.ma_tc[0]=='')){
								condition.ma_tc = {$in:r.ma_tc};
							}
							
						}
						if(r.tk && r.tk.length>0){
							condition.tk_thue_no = {$regex:'^' + r.tk,$options:'i'};
						}
						
						vatvao.find(condition,{t_tien:1,t_thue:1},function(error,rs){
							
							if(error) return callback(error);
							if(r.phan_loai=='1' || r.phan_loai=='2'){
								r.t_thue = rs.csum('t_thue');
							}else{
								r.t_thue =0;
							}
							if(r.phan_loai=='1' || r.phan_loai=='3'){
								r.t_tien = rs.csum('t_tien');
							}else{
								r.t_tien =0;
							}
							calc(report,r,'t_tien',function(er){
								calc(report,r,'t_thue',function(er2){
									callback(null,r);
								});
							});
						});
					}else{
						if(r.tk && r.tk.length>0){
							condition.tk_thue_co = {$regex:'^' + r.tk,$options:'i'};
						}
						vatra.find(condition,{t_tien:1,t_thue:1},function(error,rs){
							if(error) return callback(error);
							if(r.phan_loai=='1' || r.phan_loai=='2'){
								r.t_thue = rs.csum('t_thue');
							}else{
								r.t_thue = 0;
							}
							if(r.phan_loai=='1' || r.phan_loai=='3'){
								r.t_tien = rs.csum('t_tien');
							}else{
								r.t_tien =0;
							}
							calc(report,r,'t_tien',function(er){
								calc(report,r,'t_thue',function(er2){
									callback(null,r);
								});
							});
						});
					}
				}
			},function(error,rows){
				if(error) return callback(error);
				var lq = underscore.filter(report,function(r){return (r.cong_thuc_t_tien||r.cong_thuc_t_thue) && r.phan_loai!='4';});
				var calculated = true;
				//tinh cho cac cong thuc con lai
				async.whilst(
					function(){return calculated;},
					function(c){
						calculated = false;
						async.map(report,function(rv,callback){
							async.parallel({
								//doanh so
								ds:function(cb){
									calc(lq,rv,'t_tien',function(error,caled){
										if(error){
											cb(error);
										}else{
											if(caled==true){
												calculated = true;
											}
											cb();
										}
									});
								},
								//thue
								thue:function(cb){
									calc(lq,rv,'t_thue',function(error,caled){
										if(error){
											cb(error);
										}else{
											if(caled==true){
												calculated = true;
											}
											cb();
										}
										
									});
								}
							},function(error,rs){
								if(error) return callback(error);
								callback(null);
							});
						},function(error){
							c(error);
						});
					},
					function(error){
						if(error) return callback(error);
						callback(null,report);
					}
				);
				
				
			});
		});
		
		
	});
}