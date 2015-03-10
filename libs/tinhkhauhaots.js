var qts = require("../models/qts");
var sotinhkh = require("../models/sotinhkh");
var arrayfuncs = require("./array-funcs");
var phanbokh = require("./phanbokh");
var tinhkhauhao1ts = require("./tinhkhauhao1ts");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.thang|| !condition.nam || !condition.id_app ){
		fn("Lỗi: Báo cáo này yêu cầu các tham số: so_the_ts,thang,nam,id_app");
		return;
	}
	if(condition.tinh_kh_theo_ngay==undefined){
		condition.tinh_kh_theo_ngay = true;
	}
	var  ngay_cuoi_thang = new Date(condition.nam,condition.thang,0);
	//
	qts.find({id_app:condition.id_app,ngay_kh:{$lte:ngay_cuoi_thang}}).lean().exec(function(error,tss){
		if(error) return fn(error);
		async.map(tss,function(ts,callback){
			var c = {};
			underscore.extend(c,condition);
			c.id_ts = ts._id;
			sotinhkh.findOne({id_app:c.id_app,id_ts:c.id_ts,nam:c.nam,thang:c.thang},function(error,stkh){
				if(error) return callback(error);
				//neu da sua khau hao thi khong tin lai
				if(stkh  && stkh.sua_kh) return callback(null,stkh);
				//xoa khau hao cu va tinh lai
				sotinhkh.remove({id_app:c.id_app,id_ts:c.id_ts,nam:c.nam,thang:c.thang},function(error){
					if(error) return callback(error);
					tinhkhauhao1ts(c,function(error,r){
						if(error) return callback(error);
						if(!r) return callback(null,null);
						r.id_app = c.id_app;
						r.nam = c.nam;
						r.thang = c.thang;
						sotinhkh.create(r,function(error,kq){
							if(error) return callback(error);
							kq = kq.toObject();
							kq.ten_ts = ts.ten_ts;
							kq.ma_ct = ts.ma_ct;
							kq.tk_cp = ts.tk_cp;
							kq.tk_kh = ts.tk_kh;
							kq.ma_bp = ts.ma_bp;
							//phan bo khau hao
							callback(null,kq);
						});
					});
				});
			});
			
			
		},function(error,rs){
			if(error) return fn(error);
			
			fn(null,rs);
			
		});
	});
}