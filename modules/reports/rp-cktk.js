var bgaccs = require("../../libs/cktk");
var arrayfuncs = require("../../libs/array-funcs");
var Account = require("../../models/account");
var underscore = require("underscore");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"cktk",function(req,callback){
		var condition = req.query;
		var bu_tru = condition.bu_tru;
		if(!bu_tru){
			bu_tru = false;
		}
		bgaccs(condition,function(error,report){
			if(error) return callback(error);
			report = underscore.sortBy(report,function(r){
				return r.tk;
			});
			//lay ten cua tai khoan
			report.joinModel(condition.id_app,Account,[{akey:'tk',bkey:'tk',fields:[{name:'ten_tk',value:'ten_tk'}]}],function(results){
				callback(null,results);
			});
			
		});
				
	}); 
	
}