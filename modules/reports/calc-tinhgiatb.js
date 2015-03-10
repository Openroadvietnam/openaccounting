var async = require("async");
var tinhgiatb = require("../../libs/tinhgiatb");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"tinhgiatb",function(req,callback){
		var condition = req.query;
		if(!condition.nam || !condition.tu_thang || !condition.den_thang){
			return callback("Chức năng này yêu cầu các tham số: nam,tu_thang,den_thang");
		}
		tinhgiatb(condition,function(error,results){
			if(error) return callback(error);
			callback(null,results);
		});
	});
}