var model = require("../../models/kbm_lctttt");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'kbmlctttt',{
		sort:{stt:1,ma_so:1},
		unique:['ma_so']
	});
	contr.route();
}