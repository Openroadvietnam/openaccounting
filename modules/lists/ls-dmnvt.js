var model = require("../../models/dmnvt");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'dmnvt',{sort:{ten_nvt:1}});
	contr.route();
}