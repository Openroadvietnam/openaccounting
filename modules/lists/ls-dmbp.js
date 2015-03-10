var model = require("../../models/dmbp");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'dmbp',{
		sort:{ma_bp:1},
		unique:['ma_bp']
	});
	contr.route();
}