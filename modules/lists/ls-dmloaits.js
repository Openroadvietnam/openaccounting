var model = require("../../models/dmloaits");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'dmloaits',{
		sort:{ma_loai_ts:1},
		unique:['ma_loai_ts']
	});
	contr.route();
}