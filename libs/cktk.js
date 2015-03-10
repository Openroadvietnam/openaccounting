var bgaccs = require("./cktt");
var bgcustaccs = require("./ckcn");
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.ngay || !condition.id_app ){
		fn(new Error("ngay and id_app parameter required"));
		return;
	}
	//lay dieu kien
	var tk = condition.tk; 
	if(!tk){
		tk ="";
	}
	var bu_tru = condition.bu_tru;
	if(!bu_tru){
		bu_tru = false;
	}
	async.parallel({
		//cuoi ky tai khoan thong thuong
		tt:function(callback){
			bgaccs(condition,function(error,report){
				if(error){
					callback(error);
					return;
				}
				callback(null,report);
				
			});
		},
		//cuoi ky tai khoan cong no
		cn:function(callback){
			bgcustaccs(condition,function(error,report){
				if(error){
					callback(error);
					return;
				}
				report.groupBy("tk",[{name:"du_no00",value:"du_no00"}
					,{name:"du_co00",value:"du_co00"}
					,{name:"du_no_nt00",value:"du_no_nt00"}
					,{name:"du_co_nt00",value:"du_co_nt00"}],function(error,result){
						if(error){
							callback(error);
							return;
						} 
						if(bu_tru==true){
							result.forEach(function(r){
								r.du_no00 = r.du_no00-r.du_co00;
								r.du_no_nt00 = r.du_no_nt00-r.du_co_nt00;
								if(r.du_no00<0){
									r.du_co00 = Math.abs(r.du_no00);
									r.du_no00 =0;
								}else{
									r.du_co00 =0;
								}
								if(r.du_no_nt00<0){
									r.du_co_nt00 = Math.abs(r.du_no_nt00);
									r.du_no_nt00 =0;
								}else{
									r.du_co_nt00 =0;
								}
							
							});
						}
						callback(null,result);
					});
				
				
			});
		}
		},function(error,results){
			if(error) return fn(error);
			var report =results.tt;
			results.cn.forEach(function(r){
				report.push(r);
			});
			fn(null,report);
		}
	);
}