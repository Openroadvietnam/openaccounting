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
var bgaccs = require("./cktt");
var bgcustaccs = require("./ckcn");
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.ngay || !condition.id_app ){
		fn(new Error("ngay and id_app parameter required"));
		return;
	}
	//lay dieu kien
	var tk = condition.tk; 
	if(!tk){
		tk ="";
	}
	var bu_tru = condition.bu_tru;
	if(!bu_tru){
		bu_tru = false;
	}
	async.parallel({
		//cuoi ky tai khoan thong thuong
		tt:function(callback){
			bgaccs(condition,function(error,report){
				if(error){
					callback(error);
					return;
				}
				callback(null,report);
				
			});
		},
		//cuoi ky tai khoan cong no
		cn:function(callback){
			bgcustaccs(condition,function(error,report){
				if(error){
					callback(error);
					return;
				}
				report.groupBy("tk",[{name:"du_no00",value:"du_no00"}
					,{name:"du_co00",value:"du_co00"}
					,{name:"du_no_nt00",value:"du_no_nt00"}
					,{name:"du_co_nt00",value:"du_co_nt00"}],function(error,result){
						if(error){
							callback(error);
							return;
						} 
						if(bu_tru==true){
							result.forEach(function(r){
								r.du_no00 = r.du_no00-r.du_co00;
								r.du_no_nt00 = r.du_no_nt00-r.du_co_nt00;
								if(r.du_no00<0){
									r.du_co00 = Math.abs(r.du_no00);
									r.du_no00 =0;
								}else{
									r.du_co00 =0;
								}
								if(r.du_no_nt00<0){
									r.du_co_nt00 = Math.abs(r.du_no_nt00);
									r.du_no_nt00 =0;
								}else{
									r.du_co_nt00 =0;
								}
							
							});
						}
						callback(null,result);
					});
				
				
			});
		}
		},function(error,results){
			if(error) return fn(error);
			var report =results.tt;
			results.cn.forEach(function(r){
				report.push(r);
			});
			fn(null,report);
		}
	);
}