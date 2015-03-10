var model = require("../../models/dmdvt");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'dmdvt',{
		sort:{ma_dvt:1},
		unique:['ma_dvt']
	});
	contr.creating = function(user,obj,next){
		if(!obj.ma_dvt){
			obj.ma_dvt = obj.ten_dvt
		}
		next(null,obj);
		
	}
	contr.updating = function(user,data,obj,next){ 
		if(!data.ma_dvt){
			data.ma_dvt = data.ten_dvt
		}
		next(null,data,obj);
	}
	contr.route();
}