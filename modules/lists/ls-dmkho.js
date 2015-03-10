var model = require("../../models/dmkho");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'dmkho',{
		sort:{ma_kho:1},
		unique:['ma_kho']
	});
	contr.route();
}