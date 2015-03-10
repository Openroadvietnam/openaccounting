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
var Vsocai = require("../../models/vsocai");
var dntk = require("../../libs/dntk");
var cktk = require("../../libs/cktk");
var kbmbcdkt = require("../../models/kbm_bcdkt");
var async = require("async");
var underscore = require("underscore");
var controller = require("../../controllers/controllerRPT");
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
	//
	var rpt = new controller(router,"bcdkt",function(req,callback){
		var query = req.query;
		if(!query.den_ngay){
			return callback("Báo cáo này yêu cầu tham số den_ngay");
		}
		if(!query.ma_dvcs){
			query.ma_dvcs ="";
		}
		var report;
		kbmbcdkt.find({id_app:query.id_app},function(error,kbm){
			if(error){
				return callback(error);
			}
			report = kbm;
			kbm.forEach(function(r){
				if(r.cong_thuc){
					r.cong_thuc_so_dn = r.cong_thuc;
					r.cong_thuc_so_ck = r.cong_thuc;
					r.cong_thuc_so_dn_nt = r.cong_thuc;
					r.cong_thuc_so_ck_nt = r.cong_thuc;
				}
			});
			async.map(report,function(r,c1){
				if(r.cach_tinh=='1' || r.ngoai_bang==true){
					c1(null,r);
				}else{
					//tinh theo so du tai khoan
					if(r.cach_tinh=='2'){
						var condition = {};
						underscore.extend(condition,query);
						condition.ngay = query.den_ngay;
						condition.bu_tru = false;
						condition.tk = r.tk;
						async.parallel({
						//so dau nam
						dn: function(callback){
							dntk(condition,function(error,result){
								if(error) return callback(error);
								if(r.phan_loai=='1'){//tai san
									r.so_dn = result.csum('du_no1')-result.csum('du_co1');
									r.so_dn_nt = result.csum('du_no_nt1')-result.csum('du_co_nt1');
								}else{//nguon von
									r.so_dn = result.csum('du_co1')-result.csum('du_no1');
									r.so_dn_nt = result.csum('du_co_nt1')-result.csum('du_no_nt1');
								}
								
								if(r.so_dn<0 && r.khong_am==false){
									r.so_dn =0;
								}
								if(r.so_dn_nt<0 && r.khong_am==false){
									r.so_dn_nt =0;
								}
								//set gia trị cho cac dong lien quan
								calc(report,r,'so_dn',function(error){
									if(error) return callback(error);
									calc(report,r,'so_dn_nt',function(error){
										if(error) return callback(error);
										callback(null,r);
									});
									
								});
								
							});
						},
						//so cuoi ky
						ck: function(callback){
							cktk(condition,function(error,result){
								if(error) return callback(error);
								if(r.phan_loai=='1'){//tai san
									r.so_ck = result.csum('du_no00')-result.csum('du_co00');
									r.so_ck_nt = result.csum('du_no_nt00')-result.csum('du_co_nt00');
								}else{//nguon von
									r.so_ck = result.csum('du_co00')-result.csum('du_no00');
									r.so_ck_nt = result.csum('du_co_nt00')-result.csum('du_no_nt00');
								}
								
								if(r.so_ck<0 && r.khong_am==false){
									r.so_ck =0;
								}
								if(r.so_ck_nt<0 && r.khong_am==false){
									r.so_ck_nt =0;
								}
								//set gia trị cho cac dong lien quan
								calc(report,r,'so_ck',function(error){
									if(error) return callback(error);
									calc(report,r,'so_ck_nt',function(error){
										if(error) return callback(error);
										callback(null,r);
									});
								});
								
							});
						}
						},
						function(error,results){
							if(error) return c1(error);
							c1(null,r);
						});
						
					}else{
						//tinh theo so du ben no
						if(r.cach_tinh=='3'){
							var condition = {};
							underscore.extend(condition,query);
							condition.ngay = query.den_ngay;
							condition.bu_tru = r.bu_tru_cong_no;
							condition.tk = r.tk;
							async.parallel({
							//so dau nam
							dn: function(callback){
								dntk(condition,function(error,result){
									if(error) return callback(error);
									r.so_dn = result.csum('du_no1');
									r.so_dn_nt = result.csum('du_no_nt1');
									if(r.so_dn<0 && r.khong_am==false){
										r.so_dn =0;
									}
									if(r.so_dn_nt<0 && r.khong_am==false){
										r.so_dn_nt =0;
									}
									//set gia trị cho cac dong lien quan
									calc(report,r,'so_dn',function(error){
										if(error) return callback(error);
										calc(report,r,'so_dn_nt',function(error){
											if(error) return callback(error);
											callback(null,r);
										});
									});
									
								});
							},
							//so cuoi ky
							ck: function(callback){
								cktk(condition,function(error,result){
									if(error) return callback(error);
									r.so_ck = result.csum('du_no00')
									r.so_ck_nt = result.csum('du_no_nt00')
									if(r.so_ck<0 && r.khong_am==false){
										r.so_ck =0;
									}
									if(r.so_ck_nt<0 && r.khong_am==false){
										r.so_ck_nt =0;
									}
									//set gia trị cho cac dong lien quan
									calc(report,r,'so_ck',function(error){
										if(error) return callback(error);
										calc(report,r,'so_ck_nt',function(error){
											if(error) return callback(error);
											callback(null,r);
										});
									});
									
								});
							}
							},
							function(error,results){
								if(error) return c1(error);
								c1(null,r);
							});
						}else{//tinh theo so du ben co
							var condition = {};
							underscore.extend(condition,query);
							condition.ngay = query.den_ngay;
							condition.bu_tru = r.bu_tru_cong_no;
							condition.tk = r.tk;
							//so dau nam
							async.parallel({
							dn: function(callback){
								dntk(condition,function(error,result){
									if(error) return callback(error);
									r.so_dn = result.csum('du_co1');
									r.so_dn_nt = result.csum('du_co_nt1');
									if(r.so_dn<0 && r.khong_am==false){
										r.so_dn =0;
									}
									if(r.so_dn_nt<0 && r.khong_am==false){
										r.so_dn_nt =0;
									}
									//set gia trị cho cac dong lien quan
									calc(report,r,'so_dn',function(error){
										if(error) return callback(error);
										calc(report,r,'so_dn_nt',function(error){
											if(error) return callback(error);
											callback(null,r);
										});
									});
									
								});
							},
							//so cuoi ky
							ck: function(callback){
								cktk(condition,function(error,result){
									if(error) return callback(error);
									r.so_ck = result.csum('du_co00');
									r.so_ck_nt = result.csum('du_co_nt00')
									if(r.so_ck<0 && r.khong_am==false){
										r.so_ck =0;
									}
									if(r.so_ck_nt<0 && r.khong_am==false){
										r.so_ck_nt =0;
									}
									//set gia trị cho cac dong lien quan
									calc(report,r,'so_ck',function(error){
										if(error) return callback(error);
										calc(report,r,'so_ck_nt',function(error){
											if(error) return callback(error);
											callback(null,r);
										});
									});
									
								});
							}
							},
							function(error,results){
								if(error) return c1(error);
								c1(null,r);
							});
						}
					}
				}
			},function(error,rows){
				var lq = underscore.filter(report,function(r){return r.cong_thuc_so_dn||r.cong_thuc_so_ck;});
				var calculated = true;
				//tinh cho cac cong thuc con lai
				async.whilst(
					function(){return calculated;},
					function(c){
						calculated = false;
						async.each(report,function(rv,callback){
							async.parallel({
								dn:function(callback2){
									if(rv.so_dn || rv.so_dn==0){
										calc(lq,rv,'so_dn',function(error,caled){
											if(error){
												return callback2(error);
											}else{
												if(caled==true){
													calculated = true;
												}
											}
											calc(lq,rv,'so_dn_nt',function(error,caled){
												if(error){
													return callback2(error);
												}else{
													if(caled==true){
														calculated = true;
													}
												}
												callback2();
											});
											
										});
										
									}else{
										callback2();
									}
								},
								ck:function(callback2){
									if(rv.so_ck || rv.so_ck==0){
										calc(lq,rv,'so_ck',function(error,caled){
											if(error){
												return callback2(error);
											}else{
												if(caled==true){
													calculated = true;
												}
											}
											calc(lq,rv,'so_ck_nt',function(error,caled){
												if(error){
													callback2(error);
												}else{
													if(caled==true){
														calculated = true;
													}
												}
												callback2();
											});
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
						if(error) return callback(error)
						callback(null,report);
					}
				);
				
				
			});
		});
	});
}