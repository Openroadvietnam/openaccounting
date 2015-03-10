var sokho = require("../../models/sokho");
var dmvt = require("../../models/dmvt");
var async = require("async");
var underscore = require("underscore");
var arrayfuncs = require("../../libs/array-funcs");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"dtbanletheovt",function(req,callback){
	
		var condition = req.query;
		if( !condition.tu_ngay || !condition.den_ngay){
			return callback("Báo cáo này yêu cầu các tham số:tu_ngay,den_ngay");
		}
		var query ={id_app:condition.id_app,ma_ct:{$in:['PBL','SO1']}};
		query.ngay_ct ={$gte:condition.tu_ngay,$lte:condition.den_ngay};
		if(condition.ma_dvcs){
			query.ma_dvcs= {$regex:condition.ma_dvcs,$options:'i'}
		}
		if(condition.ma_vt){
			query.ma_vt= {$regex:condition.ma_vt,$options:'i'}
		}
		if(condition.ma_kho){
			query.ma_kho= {$regex:condition.ma_kho,$options:'i'}
		}
		
		sokho.find(query).lean().exec(function(error,rs){
			if(error)  {
				console.log(error);
				return callback(error);
			}
			
			rs.groupBy('ma_vt',[{name:'sl_xuat',value:'sl_xuat'},{name:'tien',value:'tien'},{name:'tien_ck',value:'tien_ck'}
						,{name:'tien_xuat',value:'tien_xuat'}],function(error,rs){
				if(error) {
					console.log(error);
					return callback(error);
				}
				//sap xep
				var report = underscore.sortBy(rs,function(r){
					return r.ma_vt;
				})
				var i=1;
				report.forEach(function(r){
					r.stt = i
					r.bold = false;
					r.doanh_thu = r.tien - r.tien_ck;
					r.lai = r.doanh_thu - r.tien_xuat;
					i++;
				});
				report.joinModel(condition.id_app,dmvt,[{akey:'ma_vt',bkey:'ma_vt',fields:[{name:'ten_vt',value:'ten_vt'},{name:'ma_dvt',value:'ma_dvt'}]}],function(rs){
					//dong tong cong
					report.push({
						ten_vt:'Tổng cộng',
						sl_xuat:report.csum('sl_xuat'),
						tien:report.csum('tien'),
						tien_ck:report.csum('tien_ck'),
						doanh_thu:report.csum('doanh_thu'),
						tien_xuat:report.csum('tien_xuat'),
						lai:report.csum('lai'),
						bold:true
					});
					//ket qua
					callback(null,report);
				});
				
			});
		});
	});
}