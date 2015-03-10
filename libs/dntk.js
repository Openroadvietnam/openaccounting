var bgaccs = require("./dntt");
var bgcustaccs = require("./dncn");
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.ngay || !condition.id_app ){
		fn(new Error("ngay and id_app required"));
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
		//dau ky tai khoan thong thuong
		tt:function(callback){
			bgaccs(condition,function(error,report){
				if(error){
					callback(error);
					return;
				}
				callback(null,report);
				
			});
		},
		//dau ky tai khoan cong no
		cn:function(callback){
			bgcustaccs(condition,function(error,report){
				if(error){
					callback(error);
					return;
				}
				
				report.groupBy("tk",[{name:"du_no1",value:"du_no1"}
					,{name:"du_co1",value:"du_co1"}
					,{name:"du_no_nt1",value:"du_no_nt1"}
					,{name:"du_co_nt1",value:"du_co_nt1"}],function(error,result){
						if(error){
							callback(error);
							return;
						} 
						
						if(bu_tru==true){
							result.forEach(function(r){
								r.du_no1 = r.du_no1-r.du_co1;
								r.du_no_nt1 = r.du_no_nt1-r.du_co_nt1;
								if(r.du_no1<0){
									r.du_co1 = Math.abs(r.du_no1);
									r.du_no1 =0;
								}else{
									r.du_co1 =0;
								}
								if(r.du_no_nt1<0){
									r.du_co_nt1 = Math.abs(r.du_no_nt1);
									r.du_no_nt1 =0;
								}else{
									r.du_co_nt1 =0;
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