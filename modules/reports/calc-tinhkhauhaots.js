var async = require("async");
var tinhkhauhaots = require("../../libs/tinhkhauhaots");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"tinhkhauhaots",function(req,callback){
		var condition = req.query;
		if(!condition.nam || !condition.thang){
			return callback("Chức năng này yêu cầu các tham số: nam,thang");
		}
		tinhkhauhaots(condition,function(error,results){
			if(error) return callback(error);
			callback(null,results);
		});
	});
}