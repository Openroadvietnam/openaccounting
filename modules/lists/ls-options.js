var model = require("../../models/options");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'options',{
		sort:{id_func:1},
		unique:['id_func']
	});
	contr.route();
}