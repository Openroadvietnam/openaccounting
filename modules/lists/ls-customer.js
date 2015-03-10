var model = require("../../models/customer");
var controller = require("../../controllers/controller");
var createdOrUpdated = function(user,obj,next){
	var id_app = user.current_id_app;
	if(!obj.ma_kh || obj.ma_kh==""){
		model.findByIdAndUpdate(obj._id,{$set:{ma_kh:obj._id.toString().toUpperCase()}},function(error,kh){
			if(error) {
				return next(error);
			}else{
				if(kh){
					next(null,kh);
					return;
				}else{
					return next(new Error("customer is not exists"));
				}
			}
			
		});
	}else{
		next(null,obj);
	}
	
}
var customer = function(router){
	var contr = new controller(router,model,"customer",{
		sort:		{ten_kh:1},
		unique:		['ma_kh']
	});
	contr.route();
	contr.created = createdOrUpdated;
	contr.updated = createdOrUpdated;
}
module.exports = customer;
