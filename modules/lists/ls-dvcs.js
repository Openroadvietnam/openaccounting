var model = require("../../models/dvcs");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'dvcs',{sort:{ten_dvcs:1}});
	contr.route();
}