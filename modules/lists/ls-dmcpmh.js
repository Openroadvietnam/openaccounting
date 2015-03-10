var model = require("../../models/dmcpmh");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'dmcpmh',{
		sort:{ma_cp:1},
		unique:['ma_cp']
	});
	contr.route();
}