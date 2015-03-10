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
var model = require("../../models/cdvt");

var controller = require("../../controllers/controller");
var dmstt = require("../../models/app");
var dvcs = require("../../models/dvcs");
var dmvt = require("../../models/dmvt");
var dmkho = require("../../models/dmkho");
var arrayfunction = require("../../libs/array-funcs");
var async = require("async");
var cdvt = function(router){
	var contr = new controller(router,model,"cdvt",{
		sort:		{nam:1,ma_dvcs:1,ma_kho:1,ma_vt:1},
		unique:		['ma_dvcs','ma_vt','ma_kho','nam']
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
				result.joinModel(id_app,dmvt,[{akey:'ma_vt',bkey:'ma_vt',fields:[{name:'ten_vt',value:'ten_vt'}]}],function(kq){
					callback(null,kq);
				});
			},
			kho:function(callback){
				result.joinModel(id_app,dmkho,[{akey:'ma_kho',bkey:'ma_kho',fields:[{name:'ten_kho',value:'ten_kho'}]}],function(kq){
					callback(null,kq);
				});
			}
			
		},function(error,results){
			if(error) return fn(error);
			fn(null,result);
		});
		
		
	}
	contr.creating = function(user,obj,callback){
		id_app = user.current_id_app;
		dmstt.findOne({_id:id_app},function(error,stt){
			if(error) return callback(error);
			if(!stt){
				return callback("Lỗi: Chưa khai báo ngày bắt đầu sử dụng chương trình");
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
				return callback("Lỗi: Chưa khai báo ngày bắt đầu sử dụng chương trình");
			}
			var nam = stt.nam_bd;
			if(data.nam && data.nam != nam){
				return callback("Lỗi: năm khác năm bắt đầu sử dụng chương trình");
			}
			callback(null,data,obj);
		});
	}
}

module.exports = cdvt;