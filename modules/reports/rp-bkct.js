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
var Account = require("../../models/account");
var Customer = require("../../models/customer");
var arrayFuncs = require("../../libs/array-funcs");
var Socai = require("../../models/socai");
var underscore = require("underscore");
var async = require("async");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"bkct",function(req,callback){
		var id_app = req.query.id_app;
		var query ={};
		query.id_app = id_app;
		if(req.query.q){
			var q = eval("(" + req.query.q + ")")
			underscore.extend(query,q)
		}else{
			query.ngay_ct = {$gte:req.query.tu_ngay,$lte:req.query.den_ngay};
			if(req.query.dien_giai && req.query.dien_giai!=''){
				query.dien_giai = {$regex:req.query.dien_giai,$options:'i'};
			}
			if(req.query.so_ct && req.query.so_ct!=''){
				query.so_ct = {$regex:req.query.so_ct,$options:'i'};
			}
			if(req.query.ma_dvcs && req.query.ma_dvcs!=''){
				query.ma_dvcs = {$regex:req.query.ma_dvcs,$options:'i'};
			}
		}
		var o = {};
		o.map = function(){
			var key= "bkct";
			var value = this;
			value.systotal =0;
			emit(key,value);
		}
		o.reduce = function(key,values){
			var reducevalue = {detail:values};
			return reducevalue;
		}
		o.query = query;
		Socai.mapReduce(o,function(error,results){
			if(error) return callback(error);
			if(results.length==0) { return callback(null,results);}
			var rp = [];
			//details
			if(results[0].value.detail){
				results[0].value.detail.forEach(function(r){
					rp.push(r);
				});
			}else{
				rp.push(results[0].value);
			}
			async.parallel([
				function(callback){//get account name
					rp.joinModel(req.query.id_app,Account,[{akey:'tk_no',bkey:'tk',fields:[{name:'ten_tk_no',value:'ten_tk'}]},
											{akey:'tk_co',bkey:'tk',fields:[{name:'ten_tk_co',value:'ten_tk'}]}	],function(results){
						callback();
					});
				},
				function(callback){//get customer name
					rp.joinModel(req.query.id_app,Customer,[{akey:'ma_kh_no',bkey:'ma_kh',fields:[{name:'ten_kh_no',value:'ten_kh'}]},
														{akey:'ma_kh_co',bkey:'ma_kh',fields:[{name:'ten_kh_co',value:'ten_kh'}]}
											],function(results){
						callback();
					});
					
				}
				
				
			],function(error,result){
				var rt = {dien_giai:'Tổng cộng',tien:rp.csum('tien'),tien_nt:rp.csum('tien_nt'),systotal:1,bold:true};
				rp.push(rt);
				rp = underscore.sortBy(rp,function(r){
					return r.ngay_ct + r.ma_ct + r.so_ct;
				});
				callback(error,rp);
			});
			
		});
			
	});
}