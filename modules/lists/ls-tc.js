var model = require("../../models/tc");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'tc',{
		sort:{ma_tc:1},
		unique:['ma_tc']
	});
	contr.route();
}