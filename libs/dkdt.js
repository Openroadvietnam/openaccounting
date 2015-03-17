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
var cddt = require("../models/cddt");
var Vsocai = require("../models/vsocai");
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.ngay || !condition.id_app || !condition.tk ){
		fn(new Error("Hàm này yêu cầu các tham số ngay,id_app,tk"));
		return;
	}
	//lay dieu kien
	var ma_dvcs = condition.ma_dvcs;
	if(!ma_dvcs){ 
		ma_dvcs ="";
	}
	ma_dvcs ={$regex:ma_dvcs,$options:'i'};
	
	var tk = condition.tk; 
	if(underscore.isArray(tk)){
		var tks;
		tk.forEach(function(t){
			if(tks){
				tks = tks + "|^" + t;
			}else{
				tks = "^" + t;
			}
		});
		if(!tks){tks = '^'};
		tk  ={$regex:tks,$options:'i' };
	}else{
		tk ={$regex:'^' + tk,$options:'i' };
	}
	
	var ma_dt = condition.ma_dt;
	if(!ma_dt){
		ma_dt="";
	}
	ma_dt={$regex:ma_dt,$options:'i' };
	
	var ngay = new Date(condition.ngay);
	var nam = ngay.getFullYear();
	var ngay_dn = new Date(nam.toString() +"-01-01");
	var id_app = condition.id_app;
	
	async.parallel({
		//dau nam
		dn:function(callback){
			var c_dk = {id_app:id_app,nam:nam,tk:tk,ma_dt:ma_dt,ma_dvcs:ma_dvcs};
			cddt.find(c_dk,function(error,results){
				if(error){
					callback(errror);
					return;
				}
				callback(null,results);
			});
			
		},
		//phat sinh
		ps:function(callback){
			var query = {id_app:id_app
						,ngay_ct:{$gte:ngay_dn,$lt:ngay}
						,ma_dt:ma_dt
						,tk:tk
						,ma_dvcs:ma_dvcs};
			Vsocai.find(query,function(error,pss){
				if(error){
					callback(error);
					return;
				}
				callback(null,pss);
				
			});
		}
	},function(error,results){
		if(error){
			return fn(error);
		}
		var data = results.dn;
		
		results.ps.forEach(function(r){
			data.push(r);
		});
		var groups = underscore.groupBy(data,function(r){
			return r.tk + "$s" + r.ma_dt;
		});

		//
		var keys = underscore.keys(groups);
		
		async.map(keys,function(key,callback){
			var value = groups[key];
			var r = {};
			var tk_ma_dt = key.split("$s");
			r.tk = tk_ma_dt[0];
			r.ma_dt = tk_ma_dt[1];
			r.du_no00 = value.csum("du_no00") + value.csum("ps_no") - value.csum("du_co00") - value.csum("ps_co");
			r.du_no_nt00 = value.csum("du_no_nt00") + value.csum("ps_no_nt") - value.csum("du_co_nt00") - value.csum("ps_co_nt");
			if(r.du_no00<0){
				r.du_co00 = Math.abs(r.du_no00);
				r.du_no00 = 0;
			}else{
				r.du_co00 = 0;
			}
			if(r.du_no_nt00<0){
				r.du_co_nt00 = Math.abs(r.du_no_nt00);
				r.du_no_nt00 = 0;
			}else{
				r.du_co_nt00 = 0;
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