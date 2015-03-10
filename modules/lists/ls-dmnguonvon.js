var model = require("../../models/dmnguonvon");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'dmnguonvon',{
		sort:{ma_nguon_von:1},
		unique:['ma_nguon_von']
	});
	contr.route();
}