var model = require("../../models/right");
var User = require("../../models/user");
var Notification = require("../../models/notification");
var underscore = require("underscore");
var async = require("async");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'right',{
		require_id_app:true,
		sort:{name:1},
		unique:	['id_app','email','module']
	});
	contr.route();
}
