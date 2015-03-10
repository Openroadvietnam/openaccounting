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
var socai = require("../../models/socai");
var arrayfuncs = require("../../libs/array-funcs");
var kbmkqhdkd = require("../../models/kbm_kqhdkd");
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
	var rpt = new controller(router,"kqhdkd",function(req,callback){
		var query = req.query;
		if(!query.den_ngay || !query.tu_ngay || !query.den_ngay_kt || !query.tu_ngay_kt){
			return callback("Báo cáo này yêu cầu tham số den_ngay");
		}
		var report;
		kbmkqhdkd.find({id_app:query.id_app},function(error,kbm){
			if(error){
				return callback(error);
			}
			report = kbm;
			kbm.forEach(function(r){
				if(r.cong_thuc){
					r.cong_thuc_so_kn = r.cong_thuc;
					r.cong_thuc_so_kn_nt = r.cong_thuc;
					r.cong_thuc_so_kt = r.cong_thuc;
					r.cong_thuc_so_kt_nt = r.cong_thuc;
				}
			});
			async.map(report,function(r,c1){
				if(r.cach_tinh=='1'){
					c1(null,r);
				}else{
					//tinh theo so du tai khoan
					async.parallel({
						//tinh ky truoc
						ky_truoc:function(callback){
							var condition = {
								ngay_ct:{$gte:query.tu_ngay_kt,$lte:query.den_ngay_kt},
								ma_dvcs:{$regex:'^' + query.ma_dvcs,$options:'i'},
								id_app:query.id_app
							};
							var tk_no = getRegString(r.tk_no);
							if(tk_no){
								if(r.giam_tru_no){
									condition.tk_no={$not:new RegExp(tk_no)};
								}else{
									condition.tk_no={$regex:tk_no,$options:'i'};
								}
							}
							var tk_co = getRegString(r.tk_co);
							if(tk_co){
								if(r.giam_tru_co && tk_co){
									condition.tk_co={$not:new RegExp(tk_co)};
								}else{
									condition.tk_co={$regex:tk_co,$options:'i'};
								}
							}
							
							socai.find(condition,{tien:1,tien_nt:1},function(error,rs){
								if(error) return callback(error);
								r.so_kt = rs.csum('tien');
								r.so_kt_nt = rs.csum('tien_nt');
								calc(report,r,'so_kt',function(er){
									calc(report,r,'so_kt_nt',function(er2){
										callback(null,r);
									});
								});
							});
							
						},
						//tinh ky nay
						ky_nay:function(callback){
							var condition = {
								ngay_ct:{$gte:query.tu_ngay,$lte:query.den_ngay},
								ma_dvcs:{$regex:'^' + query.ma_dvcs,$options:'i'},
								id_app:query.id_app
							};
							
							var tk_no = getRegString(r.tk_no);
							if(tk_no){
								if(r.giam_tru_no){
									condition.tk_no={$not:new RegExp(tk_no)};
								}else{
									condition.tk_no={$regex:tk_no,$options:'i'};
								}
							}
							var tk_co = getRegString(r.tk_co);
							if(tk_co){
								if(r.giam_tru_co && tk_co){
									condition.tk_co={$not:new RegExp(tk_co)};
								}else{
									condition.tk_co={$regex:tk_co,$options:'i'};
								}
							}
							
							socai.find(condition,{tien:1,tien_nt:1},function(error,rs){
								if(error) return callback(error);
								r.so_kn = rs.csum('tien');
								r.so_kn_nt = rs.csum('tien_nt');
								calc(report,r,'so_kn',function(er){
									calc(report,r,'so_kn_nt',function(er2){
										callback(null,r);
									});
								});
							});
						}
					},function(error,results){
						c1(error,results);
					});
				}
			},function(error,rows){
				if(error) return callback(error);
				var lq = underscore.filter(report,function(r){return r.cong_thuc_so_kn||r.cong_thuc_so_kt;});
				var calculated = true;
				//tinh cho cac cong thuc con lai
				async.whilst(
					function(){return calculated;},
					function(c){
						calculated = false;
						async.each(report,function(rv,callback){
							async.parallel({
								//tinh cho ky truoc
								kt:function(callback2){
									if(rv.so_kt || rv.so_kt==0){
										async.parallel({
											//tinh tien viet
											tv:function(cb){
												calc(lq,rv,'so_kt',function(error,caled){
													if(error){
														cb(error);
													}else{
														if(caled==true){
															calculated = true;
														}
													}
													cb();
												});
											},
											//tinh tien ngoai te
											nt:function(cb){
												calc(lq,rv,'so_kt_nt',function(error,caled){
													if(error){
														cb(error);
													}else{
														if(caled==true){
															calculated = true;
														}
													}
													cb();
												});
											}
										},function(er,rs){
											if(error) return callback2(error);
											callback2();
										});
										
									}else{
										callback2();
									}
								},
								//tinh cho ky nay
								kn:function(callback2){
									if(rv.so_kn || rv.so_kn==0){
										async.parallel({
											//tinh tien viet
											tv:function(cb){
												calc(lq,rv,'so_kn',function(error,caled){
													if(error){
														cb(error);
													}else{
														if(caled==true){
															calculated = true;
														}
													}
													cb();
												});
											},
											//tinh tien ngoai te
											nt:function(cb){
												calc(lq,rv,'so_kn_nt',function(error,caled){
													if(error){
														cb(error);
													}else{
														if(caled==true){
															calculated = true;
														}
													}
													cb();
												});
											}
										},function(er,rs){
											if(error) return callback2(error);
											callback2();
										});
										
									}else{
										callback2();
									}
								}
							},function(error,results){
								callback();
							});
							
						},function(error){
							c(error);
						});
					},
					function(error){
						callback(null,report);
					}
				);
				
				
			});
		});
		
		
	});
}