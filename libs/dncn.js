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
var Cdkh = require("../models/cdkh");
var Vsocai = require("../models/vsocai");
var arrayfuncs = require("./array-funcs");
var dstkcn = require("./dstkcn");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.ngay || !condition.id_app ){
		fn(new Error("ngay and id_app parameter condition"));
		return;
	}
	//lay dieu kien
	var ma_dvcs = condition.ma_dvcs;
	if(!ma_dvcs){ 
		ma_dvcs ="";
	}
	ma_dvcs ={$regex:ma_dvcs,$options:'i'};
	
	var tk = condition.tk; 
	if(!tk){
		tk ="";
	}
	tk ={$regex:'^' + tk,$options:'i' };
	var ma_kh = condition.ma_kh;
	if(!ma_kh){
		ma_kh="";
	}
	ma_kh={$regex:ma_kh,$options:'i' };
	
	var ngay = new Date(condition.ngay);
	var nam = ngay.getFullYear();
	var ngay_dn = new Date(nam.toString() +"-01-01");
	var ngay_dn_lich = new Date(nam.toString() +"-01-01");
	var id_app = condition.id_app;
	
	async.parallel({
		//dau nam
		dn:function(callback){
			
			var c_dk = {id_app:id_app,nam:nam,tk:tk,ma_kh:ma_kh,ma_dvcs:ma_dvcs};
			Cdkh.find(c_dk,function(error,results){
				if(error){
					callback(errror);
					return;
				}
				callback(null,results);
			});
			
		},
		//phat sinh
		ps:function(callback){
			
			async.waterfall(
				[
					function(callback1){
						//get dstkcn
						dstkcn(id_app,tk,function(error,accs){
							if(error){
								callback1(error);
								return;
							}
							callback1(null,accs);
						});
						
					},
					function(accs,callback1){
						var query = {id_app:id_app
									,ngay_ct:{$gte:ngay_dn_lich,$lt:ngay_dn}
									,ma_kh:ma_kh
									,tk:tk
									,tk:{$in:accs}
									,ma_dvcs:ma_dvcs};
						Vsocai.find(query,function(error,pss){
							if(error){
								callback1(error);
								return;
							}
							callback1(null,pss);
							
						});
					}
				],
				function(error,result){
					if(error){
						callback(error);
						return;
					}
					callback(null,result);
				}
			);
		}
	},function(error,results){
		if(error){
			fn(error);
			return;
		}
		var data = results.dn;
		
		results.ps.forEach(function(r){
			data.push(r);
		});
		var groups = underscore.groupBy(data,function(r){
			return r.tk + "$s" + r.ma_kh;
		});

		//
		var keys = underscore.keys(groups);
		
		async.map(keys,function(key,callback){
			var value = groups[key];
			var r = {};
			var tk_ma_kh = key.split("$s");
			r.tk = tk_ma_kh[0];
			r.ma_kh = tk_ma_kh[1];
			r.du_no1 = value.csum("du_no1") + value.csum("ps_no") - value.csum("du_co1") - value.csum("ps_co");
			r.du_no_nt1 = value.csum("du_no_nt1") + value.csum("ps_no_nt") - value.csum("du_co_nt1") - value.csum("ps_co_nt");
			if(r.du_no1<0){
				r.du_co1 = Math.abs(r.du_no1);
				r.du_no1 = 0;
			}else{
				r.du_co1 = 0;
			}
			if(r.du_no_nt1<0){
				r.du_co_nt1 = Math.abs(r.du_no_nt1);
				r.du_no_nt1 = 0;
			}else{
				r.du_co_nt1 = 0;
			}
			callback(null,r);
		},function(error,result){
			if(error){
				fn(error);
				return;
			}
			fn(null,result);
		}
		);
	}
	);
}