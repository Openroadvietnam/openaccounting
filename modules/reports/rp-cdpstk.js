var cdpstk = require("../../libs/cdpstk");
var Account = require("../../models/account");
var arrayFuncs = require("../../libs/array-funcs");
var underscore = require("underscore");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"cdpstk",function(req,callback){
		var query = req.query;
		if(!query.tu_ngay || !query.den_ngay){
			return callback("Báo cáo này yêu cầu các tham số tu_ngay,den_ngay");
		}
		var id_app = query.id_app;
		cdpstk(query,function(error,report){
			if(error) return callback(error);
			report.joinModel(id_app,Account,[
				{
					akey:'tk',bkey:'tk',
					fields:[
						{
							name:'ten_tk',
							value:'ten_tk'
						}
					]
				}
			],function(report){
				report.push({tk:'Tổng cộng'
							,dk_no:report.csum('dk_no',{loai_tk:1})
							,dk_co:report.csum('dk_co',{loai_tk:1})
							,ps_no:report.csum('ps_no',{loai_tk:1})
							,ps_co:report.csum('ps_co',{loai_tk:1})
							,ck_no:report.csum('ck_no',{loai_tk:1})
							,ck_co:report.csum('ck_co',{loai_tk:1})
							
							,dk_no_nt:report.csum('dk_no_nt',{loai_tk:1})
							,dk_co_nt:report.csum('dk_co_nt',{loai_tk:1})
							,ps_no_nt:report.csum('ps_no_nt',{loai_tk:1})
							,ps_co_nt:report.csum('ps_co_nt',{loai_tk:1})
							,ck_no_nt:report.csum('ck_no_nt',{loai_tk:1})
							,ck_co_nt:report.csum('ck_co_nt',{loai_tk:1})
							,systotal:1,bold:true
					}
				);
				
				var report = underscore.sortBy(report,function(r){
					return r.tk;
				});
				callback(null,report);
			});
		});
	});
}