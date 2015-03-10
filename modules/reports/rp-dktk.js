var bgaccs = require("../../libs/dktk");
var arrayfuncs = require("../../libs/array-funcs");
var Account = require("../../models/account");
var underscore = require("underscore");
var async = require("async");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"dktk",function(req,callback){
		var condition = req.query;
		var bu_tru = condition.bu_tru;
		if(!bu_tru){
			bu_tru = false;
		}
		bgaccs(condition,function(error,report){
			if(error) return callback(error);
			//lay ten cua tai khoan
			report.joinModel(condition.id_app,Account,[{akey:'tk',bkey:'tk',fields:[{name:'ten_tk',value:'ten_tk'}]}],function(results){
				callback(null,results);
			});
			
		});

	}); 
	
}