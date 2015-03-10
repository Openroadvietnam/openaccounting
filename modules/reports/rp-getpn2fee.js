var pn1 = require("../../models/pn1");
var dmvt = require("../../models/dmvt");
var async = require("async");
var underscore = require("underscore");
var arrayfuncs = require("../../libs/array-funcs");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"getpn2fee",function(req,callback){
		
		var condition = req.query;
		if( !condition.tu_ngay || !condition.den_ngay){
			return callback("Báo cáo này yêu cầu các tham số:tu_ngay,den_ngay");
		}
		async.parallel(
			{
				invoices:function(callback){
					var query ={};
					query.id_app = condition.id_app;
					query.ngay_ct ={$gte:condition.tu_ngay,$lte:condition.den_ngay};
					if(condition.ma_dvcs){
						query.ma_dvcs = condition.ma_dvcs;
					}
					if(condition.so_ct){
						query.so_ct = condition.so_ct;
					}
					
					pn1.find(query).lean().exec(function(error,results){
						if(error) return callback(error);
						callback(null,results);
					});
				}
			},
			function(error,results){
				if(error) return callback(error);
				var invoices = results.invoices;
				async.map(invoices,function(invoice,callback){
					var ds =[];
					for(var i=0;i<invoice.details.length;i++){
						var detail = invoice.details[i];
						detail.id_hd = invoice._id;
						detail.so_ct = invoice.so_ct;
						detail.ngay_ct = invoice.ngay_ct;
						detail.ma_ct =invoice.ma_ct;
						detail.tien_phi_nt = 0;
						detail.tien_phi = 0;
						detail.sel = false;
						ds.push(detail);
					}
					invoice.details = ds;
					invoice.sel = false;
					ds.joinModel(condition.id_app,dmvt,[{akey:'ma_vt',bkey:'ma_vt',fields:[{name:'ten_vt',value:'ten_vt'}
												
									]},
							],function(results){
						callback(null,invoice);
					});
					
				},
				function(error,results){
					if(error) return callback(error);
					callback(null,invoices);
				});
				
			}
		);
	});
}