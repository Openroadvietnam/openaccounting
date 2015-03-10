var model = require("../../models/dmtanggiamts");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'dmtanggiamts',{
		sort:{ma_tang_giam_ts:1},
		unique:['ma_tang_giam_ts']
	});
	contr.route();
}