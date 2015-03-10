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
var cdvt = require("../models/cdvt");
var sokho = require("../models/sokho");
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.ngay || !condition.id_app ){
		fn("Lỗi: Báo cáo này yêu cầu các tham số: ngay,id_app");
		return;
	}
	//lay dieu kien
	////don vi co so
	var ma_dvcs = condition.ma_dvcs;
	if(!ma_dvcs){ 
		ma_dvcs ="";
	}
	ma_dvcs ={$regex:ma_dvcs,$options:'i'};

	/////kho
	var ma_kho = condition.ma_kho; 
	if(!ma_kho){
		ma_kho ="";
	}
	ma_kho ={$regex:ma_kho,$options:'i'};
	////vat tu
	var ma_vt = condition.ma_vt; 
	if(!ma_vt){
		ma_vt ="";
	}
	if(underscore.isArray(ma_vt)){
		var ma_vts;
		ma_vt.forEach(function(t){
			if(ma_vts){
				ma_vts = ma_vts + "|^" + t;
			}else{
				ma_vts = "^" + t;
			}
		});
		if(!ma_vts){ma_vts = '^'};
		
		ma_vt  ={$regex:ma_vts,$options:'i' };
	}else{
		ma_vt ={$regex:ma_vt,$options:'i' };
	}
	/////dieu kien khac
	var ngay = new Date(condition.ngay);
	var nam = ngay.getFullYear();
	var ngay_dn = new Date(nam.toString() +"-01-01");
	var id_app = condition.id_app;
	
		
	async.parallel({
		//dau nam
		dn:function(callback){
			
			var c_dk = {id_app:id_app,nam:nam,ma_vt:ma_vt,ma_kho:ma_kho,ma_dvcs:ma_dvcs};
			cdvt.find(c_dk).lean().exec(function(error,results){
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
						,ma_vt:ma_vt
						,ma_kho:ma_kho
						,ma_dvcs:ma_dvcs};
			sokho.find(query,function(error,pss){
				if(error){
					callback(error);
					return;
				}
				callback(null,pss);
				
			});
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
			return r.ma_vt;
		});
		//
		var keys = underscore.keys(groups);
		async.map(keys,function(key,callback){
			var value = groups[key];
			var r = {};
			r.ma_vt = key;
			r.ton00 = value.csum("ton00") + value.csum("sl_nhap") - value.csum("sl_xuat");
			r.du00 = value.csum("du00") + value.csum("tien_nhap") - value.csum("tien_xuat");
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