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
var vsocai = require("../../models/vsocai");
var dmtk = require("../../models/account");
var dmbp = require("../../models/dmbp");
var qts = require("../../models/qts");
var sotinhkh = require("../../models/sotinhkh");
var arrayfuncs = require("../../libs/array-funcs");
var phanbokh = require("../../libs/phanbokh");
var async = require("async");
var underscore = require("underscore");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"getkhauhao",function(req,callback){
		var condition = req.query;
		if(!condition.thang || !condition.nam || !condition.id_app){
			return callback("Chức năng này yêu cầu tham số: thang,nam,id_app");
		}
		sotinhkh.find({id_app:condition.id_app,thang:Number(condition.thang) + 1,nam:condition.nam}).lean().exec(function(error,khauhaos){
			if(error) return res.send(error);
			async.map(khauhaos,function(khauhao,callback){
				//phan bo khau hao
				phanbokh(khauhao,function(error,kqpb){
					if(error) return callback(error);
					callback(null,kqpb);
				});
			},function(error,rs){
				if(error) return callback(error);
				var report = [];
				rs.forEach(function(r){
					if(r){
						r.forEach(function(q){
							report.push(q);
						});
					}
				});
				//
				async.map(report,function(khauhao,callback){
					khauhao.tk_no = khauhao.tk_cp;
					khauhao.tk_co = khauhao.tk_kh;
					khauhao.tien_nt = khauhao.gia_tri_kh_ky;
					khauhao.tien = khauhao.tien_nt;
					callback(null,khauhao);
				},function(error,rs){
					if(error) return callback(error);
					async.parallel({
						tk:function(callback){
							report.joinModel(condition.id_app,dmtk,[{akey:'tk_no',bkey:'tk',fields:[{name:'ten_tk_no',value:'ten_tk'}]},
								{akey:'tk_co',bkey:'tk',fields:[{name:'ten_tk_co',value:'ten_tk'}]}],function(r){
								callback(null,r);
							});
						},
						bp:function(callback){
							report.joinModel(condition.id_app,dmbp,[{akey:'ma_bp',bkey:'ma_bp',fields:[{name:'ten_bp',value:'ten_bp'}]}],function(r){
								callback(null,r);
							});
						}
						,
						ts:function(callback){
							report.joinModel(condition.id_app,qts,[{akey:'id_ts',bkey:'_id',fields:[{name:'ten_ts',value:'ten_ts'}]}],function(r){
								callback(null,r);
							});
						}
					},function(error,rs){
						callback(null,report);
					});
				});
			});
		});
		
	});
}