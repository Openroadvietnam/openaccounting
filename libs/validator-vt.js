var Dmvt = require("../models/dmvt");
var Dmkho = require("../models/dmkho");
exports.existsVt = [function(id_app,ma_vt,callback){
	if(!ma_vt || ma_vt.trim()==""){
		callback(true);
		return;
	}
	Dmvt.findOne({id_app:id_app,ma_vt:ma_vt},{ma_vt:1},function(error,vt){
		if(error || !vt){
			callback(false);
		}else{
			callback(true);
		}
	});
},"Mã vật tư {VALUE} không tồn tại"];
exports.existsKho = [function(id_app,ma_kho,callback){
	if(!ma_kho || ma_kho.trim()==""){
		callback(true);
		return;
	}
	Dmkho.findOne({id_app:id_app,ma_kho:ma_kho},{ma_kho:1},function(error,kho){
		if(error || !kho){
			callback(false);
		}else{
			callback(true);
		}
	});
},"Mã kho {VALUE} không tồn tại"];