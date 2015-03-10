var model = require("../../models/currency");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'currency',{
		sort:	{ma_nt:1},
		unique:	['ma_nt']
	});
	contr.route();
}
