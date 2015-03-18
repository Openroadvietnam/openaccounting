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
var dkdt = require("./dkdt");
var ckdt = require("./ckdt");
var psdt = require("./psdt");
var arrayFunctions = require("./array-funcs");
var Account = require("../models/account");
var async = require("async");
var underscore = require("underscore");
module.exports =function(query,fn){
	if(!query.tk || !query.tu_ngay || !query.den_ngay || !query.id_app){
		return fn(new Error("Hàm này yêu cầu các tham số tu_ngay,den_ngay,id_app,tk"));
	}
	if(!query.ma_dvcs){
		query.ma_dvcs ="";
	}
	if(!query.ma_dt){
		query.ma_dt ="";
	}
	async.parallel({
			dk:function(callback){
				var condition = {};
				underscore.extend(condition,query);
				condition.ngay = query.tu_ngay;
				dkdt(condition,function(error,result){
					if(error) return callback(error);
					callback(null,result);
				});
			},
			ps:function(callback){
				var condition ={id_app:query.id_app};
				condition.tk = {$regex:"^" + query.tk,$options:"i"};
				condition.ma_dt = {$regex:"^" + query.ma_dt,$options:"i"};
				condition.ma_dvcs = {$regex:query.ma_dvcs,$options:"i"};
				condition.ngay_ct = {$gte:query.tu_ngay,$lte:query.den_ngay};
				psdt(condition,function(error,result){
					if(error) return callback(error);
					callback(null,result);
				});
			},
			ck:function(callback){
				var condition = {};
				underscore.extend(condition,query);
				condition.ngay = query.den_ngay;
				ckdt(condition,function(error,result){
					if(error) return callback(error);
					callback(null,result);
				});
			}
		},function(error,results){
			if(error) return fn(error);
			var data = results.ps;
			results.dk.forEach(function(r){
				r.dk_no = r.du_no00;
				r.dk_co = r.du_co00;
				r.dk_no_nt = r.du_no_nt00;
				r.dk_co_nt = r.du_co_nt00;
				data.push(r);
			});
			results.ck.forEach(function(r){
				r.ck_no = r.du_no00;
				r.ck_co = r.du_co00;
				r.ck_no_nt = r.du_no_nt00;
				r.ck_co_nt = r.du_co_nt00;
				data.push(r)
			});
			
			data.groupBy('ma_dt',[
				{name:'dk_no',value:'dk_no'},
				{name:'dk_co',value:'dk_co'},
				{name:'dk_no_nt',value:'dk_no_nt'},
				{name:'dk_co_nt',value:'dk_co_nt'},
				
				{name:'ps_no',value:'ps_no'},
				{name:'ps_co',value:'ps_co'},
				{name:'ps_no_nt',value:'ps_no_nt'},
				{name:'ps_co_nt',value:'ps_co_nt'},
				
				{name:'ck_no',value:'ck_no'},
				{name:'ck_co',value:'ck_co'},
				{name:'ck_no_nt',value:'ck_no_nt'},
				{name:'ck_co_nt',value:'ck_co_nt'}
	
			],function(error,data){
				fn(null,data);
			});
		}
	);
}