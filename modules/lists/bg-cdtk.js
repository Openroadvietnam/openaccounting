var model = require("../../models/cdtk");
var controller = require("../../controllers/controller");
var dmstt = require("../../models/app");
var dvcs = require("../../models/dvcs");
var dmtk = require("../../models/account");
var arrayfunction = require("../../libs/array-funcs");
var async = require("async");
var cdtk = function(router){
	var contr = new controller(router,model,"cdtk",{
		sort:		{ma_dvcs:1,tk:1},
		unique:		['ma_dvcs','tk','nam']
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
				return callback(new Error("Create dmstt before creating cdtk"));
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
				return callback(new Error("Create dmstt before creating cdtk"));
			}
			var nam = stt.nam_bd;
			if(data.nam && data.nam != nam){
				return callback(new Error("bad request"));
			}
			callback(null,data,obj);
		});
	}
}

module.exports = cdtk;