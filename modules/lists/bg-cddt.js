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
var model = require("../../models/cddt");
var controller = require("../../controllers/controller");
var dmstt = require("../../models/app");
var dvcs = require("../../models/dvcs");
var dmtk = require("../../models/account");
var dmdt = require("../../models/dmdt");
var arrayfunction = require("../../libs/array-funcs");
var async = require("async");
var cddt = function(router){
	var contr = new controller(router,model,"cddt",{
		sort:		{ma_dvcs:1,ma_dt:1,tk:1},
		unique:		['ma_dvcs','tk','ma_dt','nam']
	});
	contr.route();
	contr.view = function(user,result,fn){
		id_app = user.current_id_app;
		async.parallel({
			dvcs:function(callback){
				result.joinModel(id_app,dvcs,[{akey:'ma_dvcs',bkey:'_id',fields:[{name:'ten_dvcs',value:'ten_dvcs'}]}],function(kq){
					callback(null,kq);
				});
			},
			tk:function(callback){
				result.joinModel(id_app,dmtk,[{akey:'tk',bkey:'tk',fields:[{name:'ten_tk',value:'ten_tk'}]}],function(kq){
					callback(null,kq);
				});
			},
			dt:function(callback){
				result.joinModel(id_app,dmdt,[{akey:'ma_dt',bkey:'ma_dt',fields:[{name:'ten_dt',value:'ten_dt'}]}],function(kq){
					callback(null,kq);
				});
			}
		},function(error,resutls){
			if(error) return fn(error);
			fn(null,result);
		});
		
		
	}
	contr.creating = function(user,obj,callback){
		id_app = user.current_id_app;
		dmstt.findOne({_id:id_app},function(error,stt){
			if(error) return callback(error);
			if(!stt){
				return callback(new Error("Create dmstt before creating cddt"));
			}
			var nam = stt.nam_bd;
			obj.nam = nam;
			callback(null,obj)
		});
	}
	contr.updating = function(user,data,obj,callback){
		id_app = user.current_id_app;
		dmstt.findOne({_id:id_app},function(error,stt){
			if(error) return callback(error);
			if(!stt){
				return callback(new Error("Create dmstt before creating cddt"));
			}
			var nam = stt.nam_bd;
			if(data.nam && data.nam != nam){
				return callback(new Error("bad request"));
			}
			callback(null,data,obj);
		});
	}
}

module.exports = cddt;