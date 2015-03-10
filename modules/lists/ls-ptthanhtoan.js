var model = require("../../models/ptthanhtoan");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'ptthanhtoan',{
		sort:{ten:1}
	});
	contr.route();
}