var arrayfuncs = require("../../libs/array-funcs");
var dvcs = require("../../models/dvcs");
var account = require("../../models/account");
var sotinhkh = require("../../models/sotinhkh");
var nguonvon = require("../../models/dmnguonvon");
var bophan = require("../../models/dmbp");
var loaits = require("../../models/dmloaits");
var tanggiamts = require("../../models/dmtanggiamts");
var model = require("../../models/qts");
var controller = require("../../controllers/controller");
var async = require("async");
var ma_ct ='QTS';
module.exports = function(router){
	this.contr = new controller(router,model,ma_ct.toLowerCase(),{
		sort:		{ngay_ct:-1,so_ct:1}
	});
	this.contr.route();
	//creating
	this.contr.creating = function(user,obj,next){
		model.findOne({so_the_ts:obj.so_the_ts},function(error,ts){
			if(error) return next(error);
			if(ts){
				return next("Số thẻ tài sản " + obj.so_the_ts + " đã tồn tại");
			}
			next(null,obj);
		});
		
	}
	this.contr.updating = function(user,data,obj,next){
		sotinhkh.findOne({id_ts:obj._id},function(error,ts){
			if(error) return next(error);
			if(ts){
				return next("Không thể cập nhật tài sản này do đã được trích khấu hao.");
			}
			//
			if(obj.so_the_ts!=data.so_the_ts){
				model.findOne({so_the_ts:obj.so_the_ts},function(error,ts){
					if(error) return next(error);
					if(ts){
						return next("Số thẻ tài sản " + obj.so_the_ts + " đã tồn tại");
					}
					next(null,obj);
				});
			}else{
				next(null,data,obj); 
			}
		});
	}
	//deleting
	this.contr.deleting = function(user,obj,next){
		sotinhkh.findOne({id_ts:obj._id},function(error,ts){
			if(error) return next(error);
			if(ts){
				return next("Không thể xóa tài sản này do đã được trích khấu hao.");
			}
			next(null,obj);
		});
		
	}
	this.contr.view = function(user,items,fn){
		id_app = user.current_id_app;
		async.parallel({
			dv:function(callback){
				items.joinModel(id_app,dvcs,[{akey:'ma_dvcs',bkey:'_id',fields:[{name:'ten_dvcs',value:'ten_dvcs'}]}],function(kq){
					callback();
				});
			},
			tk:function(callback){
				items.joinModel(id_app,account,[{akey:'tk_ts',bkey:'tk',fields:[{name:'ten_tk_ts',value:'ten_tk'}]}
									,{akey:'tk_kh',bkey:'tk',fields:[{name:'ten_tk_kh',value:'ten_tk'}]}
									,{akey:'tk_cp',bkey:'tk',fields:[{name:'ten_tk_cp',value:'ten_tk'}]}
						],function(kq){
					callback();
				});
			},
			bp:function(callback){
				items.joinModel(id_app,bophan,[{akey:'ma_bp',bkey:'ma_bp',fields:[{name:'ten_bp',value:'ten_bp'}]}],function(kq){
					callback();
				});
			},
			loaits:function(callback){
				items.joinModel(id_app,loaits,[{akey:'ma_loai_ts',bkey:'ma_loai_ts',fields:[{name:'ten_loai_ts',value:'ten_loai_ts'}]}],function(kq){
					callback();
				});
			},
			tanggiamts:function(callback){
				items.joinModel(id_app,tanggiamts,[{akey:'ma_tang_giam_ts',bkey:'ma_tang_giam_ts',fields:[{name:'ten_tang_giam_ts',value:'ten_tang_giam_ts'}]}],function(kq){
					callback();
				});
			},
			t_nguon_von:function(callback){
				items.forEach(function(r){
					if(r.details){
						r.t_nguyen_gia = r.details.csum('nguyen_gia');
						r.t_gia_tri_da_kh = r.details.csum('gia_tri_da_kh');
						r.t_gia_tri_con_lai = r.details.csum('gia_tri_con_lai');
						r.t_gia_tri_kh_ky = r.details.csum('gia_tri_kh_ky');
					}

				});
				
				
				callback();
			},
			details_nguon_von:function(callback){
				async.each(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,nguonvon,[
												{akey:'ma_nguon_von',bkey:'ma_nguon_von',fields:[{name:'ten_nguon_von',value:'ten_nguon_von'}]}
									
															],function(kq){
							callback1();
						});
					},
					function(error){
						
						callback();
					}
				);
			}
		},function(error,results){
			
			fn(null,items);
		});
	}
}