var Account = require("../models/account");
exports.isTkcn = [function(id_app,tk,callback){
	if(!tk || tk.trim()==""){
		callback(true);
		return;
	}
	Account.findOne({id_app:id_app,tk:tk},{tk_cn:1,_id:0,loai_tk:1},function(error,acc){
		if(error || !acc || acc.loai_tk==0){
			callback(false);
		}else{
			callback(acc.tk_cn);
		}
	});
},"Tài khoản {VALUE} không tồn tại hoặc không phải là tài khoản công nợ"];
exports.isNotTkcn = [function(id_app,tk,callback){
	if(!tk || tk.trim()==""){
		callback(true);
		return;
	}
	Account.findOne({id_app:id_app,tk:tk},{tk_cn:1,_id:0,loai_tk:1},function(error,acc){
		if(error || !acc || acc.loai_tk==0){
			callback(false);
		}else{
			callback(!acc.tk_cn);
		}
	});
}, "Tài khoản {VALUE} không tồn tại hoặc không phải là tài khoản công nợ"];
exports.existsTk = [function(id_app,tk,callback){
	if(!tk || tk.trim()==""){
		callback(true);
		return;
	}
	Account.findOne({id_app:id_app,tk:tk},{tk:1,loai_tk:1},function(error,acc){
		if(error) console.log(error);
		if(!acc) console.log("not found " + tk + " of app " + id_app);
		if(error || !acc || acc.loai_tk==0){
			callback(false);
		}else{
			callback(true);
		}
	});
},"Tài khoản {VALUE} không tồn tại"];

exports.existsAnyTk = [function(id_app,tk,callback){
	if(!tk || tk.trim()==""){
		callback(true);
		return;
	}
	Account.findOne({id_app:id_app,tk:tk},{tk:1},function(error,acc){
		if(error || !acc || acc.loai_tk==0){
			callback(false);
		}else{
			callback(true);
		}
	});
},"Tài khoản {VALUE} không tồn tại"];