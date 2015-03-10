var Account = require("../models/account");
module.exports = function(id_app,tk,fn){
	var query ={id_app:id_app,tk_cn:false,tk:tk};
	Account.find(query,{tk:1,_id:0},function(error,accs){
		if(error) {
			fn(error);
			return;
		}
		var kqs =[];
		accs.forEach(function(acc){
			kqs.push(acc.tk);
		});
		fn(null,kqs);
	});
}