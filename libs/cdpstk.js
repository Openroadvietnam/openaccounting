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
var dktk = require("./dktk");
var cktk = require("./cktk");
var pstk = require("./pstk");
var arrayFunctions = require("./array-funcs");
var Account = require("../models/account");
var async = require("async");
var underscore = require("underscore");
module.exports =function(query,fn){
	if(!query.tu_ngay || !query.den_ngay || !query.id_app){
		return fn(new Error("Hàm này yêu cầu các tham số tu_ngay,den_ngay,id_app"));
	}
	if(!query.tk){
		query.tk ="";
	}
	if(!query.ma_dvcs){
		query.ma_dvcs ="";
	}
	async.parallel({
			dk:function(callback){
				var condition = {};
				underscore.extend(condition,query);
				condition.ngay = query.tu_ngay;
				dktk(condition,function(error,result){
					if(error) return callback(error);
					
					callback(null,result);
				});
			},
			ps:function(callback){
				var condition ={id_app:query.id_app};
				condition.tk = {$regex:"^" + query.tk,$options:"i"};
				condition.ma_dvcs = {$regex:query.ma_dvcs,$options:"i"};
				condition.ngay_ct = {$gte:query.tu_ngay,$lte:query.den_ngay};
				pstk(condition,function(error,result){
					if(error) return callback(error);
					
					callback(null,result);
				});
			},
			ck:function(callback){
				var condition = {};
				underscore.extend(condition,query);
				condition.ngay = query.den_ngay;
				cktk(condition,function(error,result){
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
			
			data.groupBy('tk',[
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
				//tk me
				var cdpstkme  =[];
				async.map(data,function(acc,callback){
					acc.loai_tk =1;
					var tk = acc.tk;
					async.forever(function(next){
						Account.find({tk:tk,id_app:query.id_app},{tk_me:1},function(error1,r){
							if( r && r.length==1 && r[0].tk_me && r[0].tk_me!=''){ 
								var vTK = {};
								underscore.extend(vTK,acc);
								vTK.tk = r[0].tk_me;
								cdpstkme.push(vTK);
								//tim tk me cua tk me
								tk = r[0].tk_me;
								next();
							}else{
							    next("finish or has error");
							}
						});
					},function(error0){
						callback();
					});
				},function(error,results){
					cdpstkme.groupBy('tk',[
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
			
					],function(error,dataTkMe){
						if(error) return fn(error);
						async.map(dataTkMe,function(tkMe,callback){
							Account.find({tk:tkMe.tk,id_app:query.id_app},{tk_cn:1,loai_tk:1},function(e3,rtk){
								if(rtk.length!=1){
									return callback(null);
								}
								var tk = rtk[0];
								tkMe.loai_tk = tk.loai_tk;
								if(tk.tk_cn==true && query.bu_tru==false){
									data.push(tkMe);
									return callback(null);
								}
								tkMe.dk_no = tkMe.dk_no-tkMe.dk_co;
								tkMe.ck_no = tkMe.ck_no-tkMe.ck_co;
								tkMe.dk_no_nt = tkMe.dk_no_nt-tkMe.dk_co_nt;
								tkMe.ck_no_nt = tkMe.ck_no_nt-tkMe.ck_co_nt;
								if(tkMe.dk_no<0){
									tkMe.dk_co = Math.abs(tkMe.dk_no);
									tkMe.dk_no =0;
								}else{
									tkMe.dk_co = 0;
								}
								if(tkMe.dk_no_nt<0){
									tkMe.dk_co_nt = Math.abs(tkMe.dk_no_nt);
									tkMe.dk_no_nt =0;
								}else{
									tkMe.dk_co_nt = 0;
								}
								
								if(tkMe.ck_no<0){
									tkMe.ck_co = Math.abs(tkMe.ck_no);
									tkMe.ck_no =0;
								}else{
									tkMe.ck_co = 0;
								}
								if(tkMe.ck_no_nt<0){
									tkMe.ck_co_nt = Math.abs(tkMe.ck_no_nt);
									tkMe.ck_no_nt =0;
								}else{
									tkMe.ck_co_nt = 0;
								}
								
								data.push(tkMe);
								callback(null);
							});
						},function(e,result){
							fn(null,data);
						});
						
					});
				});
				
				
			});
		}
	);
}