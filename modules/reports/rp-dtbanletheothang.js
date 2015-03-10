var databanle = require("../../libs/databanle");
var async = require("async");
var underscore = require("underscore");
var arrayfuncs = require("../../libs/array-funcs");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"dtbanletheothang",function(req,callback){
	
		var condition = req.query;
		if( !condition.nam ){
			return callback("Báo cáo này yêu cầu các tham số:nam");
		}
		var query ={id_app:condition.id_app};
		var tu_ngay = new Date(condition.nam,0,1)
		var den_ngay = new Date(condition.nam,11,31)
		query.ngay_ct ={$gte:tu_ngay,$lte:den_ngay};
		if(condition.ma_dvcs){
			query.ma_dvcs= {$regex:condition.ma_dvcs,$options:'i'}
		}
		
		databanle(query,function(error,rs){
			if(error) return callback(error);
			rs.forEach(function(r){
				r.thang = r.ngay_ct.getMonth()+1;
			});
			async.map(rs,function(r,callback){
				r.t_so_luong = r.details.csum("sl_xuat");
				r.t_tien_hang = r.details.csum("tien");
				r.t_tien_ck = r.details.csum("tien_ck");
				r.t_tien_xuat = r.details.csum("tien_xuat");
				callback(null,r);
			},function(error,rs){
				if(error) return callback(error);
				rs.groupBy('thang',[{name:'t_so_luong',value:'t_so_luong'},{name:'t_tien_hang',value:'t_tien_hang'},{name:'t_tien_ck',value:'t_tien_ck'}
						,{name:'tien_ck_hd',value:'tien_ck_hd'},{name:'t_tien_xuat',value:'t_tien_xuat'}],function(error,rs){
					if(error) return callback(error);
					//sap xep
					var report = underscore.sortBy(rs,function(r){
						return r.thang;
					})
					var i=1;
					report.forEach(function(r){
						r.stt = i
						r.bold = false;
						r.t_doanh_thu = r.t_tien_hang - r.t_tien_ck - r.tien_ck_hd;
						r.t_lai = r.t_doanh_thu - r.t_tien_xuat;
						i++;
					});
					//dong tong cong
					report.push({
						thang:'Tổng cộng',
						t_so_luong:report.csum('t_so_luong'),
						t_tien_hang:report.csum('t_tien_hang'),
						t_tien_ck:report.csum('t_tien_ck'),
						tien_ck_hd:report.csum('tien_ck_hd'),
						t_tien_xuat:report.csum('t_tien_xuat'),
						t_doanh_thu:report.csum('t_doanh_thu'),
						t_lai:report.csum('t_lai'),
						bold:true
					});
					//ket qua
					callback(null,report);
				});
			});
		});
	});
}