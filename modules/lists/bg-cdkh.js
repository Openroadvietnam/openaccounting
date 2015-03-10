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
var model = require("../../models/cdkh");
var controller = require("../../controllers/controller");
var app = require("../../models/app");
var customer = require("../../models/customer");
var dvcs = require("../../models/dvcs");
var dmtk = require("../../models/account");
var arrayfuncs = require("../../libs/array-funcs");
var async = require("async");
var cdkh = function(router){
	var contr = new controller(router,model,"cdkh",{
		sort:		{ma_dvcs:1,tk:1},
		unique:		['ma_dvcs','tk','ma_kh','nam']
	});
	contr.route();
	contr.view = function(user,result,fn){
		id_app = user.current_id_app;
		async.parallel({
			dv:function(callback){
				result.joinModel(id_app,dvcs,[{akey:'ma_dvcs',bkey:'_id',fields:[{name:'ten_dvcs',value:'ten_dvcs'}]}],function(kq){
					callback();
				});
			},
			kh:function(callback){
				result.joinModel(id_app,customer,[{akey:'ma_kh',bkey:'ma_kh',fields:[{name:'ten_kh',value:'ten_kh'}]}],function(kq){
					callback();
				});
			},
			tk:function(callback){
				result.joinModel(id_app,dmtk,[{akey:'tk',bkey:'tk',fields:[{name:'ten_tk',value:'ten_tk'}]}],function(kq){
					callback();
				});
			}
			
		},function(error,results){
			fn(null,result);
		});
	}
	contr.updating=function(user,data,obj,callback){
		id_app = user.current_id_app;
		app.findOne({_id:id_app},function(error,stt){
			if(error) return callback(error);
			if(!stt){
				return callback(new Error("Create app before creating cdkh"));
			}
			var nam = stt.nam_bd;
			if(data.nam && data.nam != nam){
				return callback(new Error("bad request"));
			}
			callback(null,data,obj);
		});
	}
	contr.creating=function(user,obj,callback){
		id_app = user.current_id_app;
		app.findOne({_id:id_app},function(error,stt){
			if(error) return callback(error);
			if(!stt){
				return callback(new Error("Create app before creating cdkh"));
			}
			var nam = stt.nam_bd;
			obj.nam = nam;
			callback(null,obj);
		});
	}
}
					
module.exports = cdkh;