var Account = require("../models/account");
exports.checkAccAndCust = function(id_app,tk,ma_kh,fn){
	if(!ma_kh){
		ma_kh ="";
	}
	if(ma_kh.trim()!=""){
		return fn();
	}
	Account.findOne({id_app:id_app,tk:tk},{tk_cn:1,_id:0},function(error,acc){
		if(error) return fn(error);
		if(!acc) return fn(new Error("Tài khoản " + tk + " không tồn tại"));
		if(acc.tk_cn==true){
			return fn(new Error("Tài khoản " + tk + " yêu cầu một mã khách"));
		}
		return fn();
	});
}