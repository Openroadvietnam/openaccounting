var pstk = require("../../libs/pstk");
var async = require("async");
var underscore = require("underscore");
var arrayfuncs = require("../../libs/array-funcs");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"getariseofaccountsbymonth",function(req,callback){
	
		
		var condition = req.query;
		if( !condition.nam | !condition.thang || !condition.id_app || !condition.tks){
			return callback("Báo cáo này yêu cầu các tham số:id_app,nam,thang,tks");
		}
		var ds_tk = condition.tks.split(",");
		var nam = condition.nam;
		var thang = Number(condition.thang)
		;
		var ngay_dau_thang = new Date(nam,thang,1);
		var ngay_cuoi_thang = new Date(nam,thang+1,0);
		var query = {id_app:condition.id_app};
		var qtks = []
		ds_tk.forEach(function(tk){
			qtks.push({tk:{$regex:'^' + tk,$options:'i'}});
			
		});
		if(qtks.length>0){
			query.$or = qtks
		}
		query.ngay_ct ={$gte:ngay_dau_thang,$lte:ngay_cuoi_thang};
		
		pstk(query,function(error,results){
			if(error) return callback(error);
			callback(null,results);
		});
		
	});
}