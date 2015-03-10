var sctvt = require("../../libs/ctvt");
var dmvt = require("../../models/dmvt");
var underscore = require("underscore");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"sctvt",function(req,callback){
		var query = req.query;
		if(!query.tu_ngay || !query.den_ngay){
			return callback("Báo cáo này yêu cầu các tham số: tu_ngay,den_ngay,ma_vt");
		}
		var id_app = query.id_app;
		sctvt(query,function(error,report){
			if(error) return callback(error);
			report.joinModel(id_app,dmvt,[
				{
					akey:'ma_vt',bkey:'ma_vt',
					fields:[
						{
							name:'ten_vt',
							value:'ten_vt'
						}
					]
				}
			],function(report){
				var report = underscore.sortBy(report,function(r){
					return r.sysorder;
				});
				callback(null,report);
			});
		});
	});
}