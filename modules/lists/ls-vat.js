var model = require("../../models/vat");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'vat',{
		sort:	{ten_thue:1},
		unique:	['ma_thue']
	});
	contr.route();
}
