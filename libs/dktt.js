var Cdtk = require("../models/cdtk");
var Vsocai = require("../models/vsocai");
var arrayfuncs = require("./array-funcs");
var dstktt = require("./dstktt");
var async = require("async");
var underscore = require("underscore");
module.exports = function(condition,fn){
	//kiem tra dieu kien
	if(!condition || !condition.ngay || !condition.id_app ){
		fn(new Error("ngay and id_app parameter required"));
		return;
	}
	//lay dieu kien
	var ma_dvcs = condition.ma_dvcs;
	if(!ma_dvcs){ 
		ma_dvcs ="";
	}
	ma_dvcs ={$regex:ma_dvcs,$options:'i'};
	
	var tk = condition.tk; 
	if(!tk){
		tk ="";
	}
	if(underscore.isArray(tk)){
		var tks;
		tk.forEach(function(t){
			if(tks){
				tks = tks + "|^" + t;
			}else{
				tks = "^" + t;
			}
		});
		if(!tks){tks = '^'};
		
		tk  ={$regex:tks,$options:'i' };
	}else{
		tk ={$regex:'^' + tk,$options:'i' };
	}

	var ngay = new Date(condition.ngay);
	var nam = ngay.getFullYear();
	var ngay_dn = new Date(nam.toString() +"-01-01");
	var id_app = condition.id_app;
	
		
	async.parallel({
		//dau nam
		dn:function(callback){
			
			var c_dk = {id_app:id_app,nam:nam,tk:tk,ma_dvcs:ma_dvcs};
			Cdtk.find(c_dk,function(error,results){
				if(error){
					callback(errror);
					return;
				}
				callback(null,results);
			});
			
		},
		//phat sinh
		ps:function(callback){
			
			async.waterfall(
				[
					function(callback1){
						//get dstkcn
						dstktt(id_app,tk,function(error,accs){
							if(error){
								callback1(error);
								return;
							}
							callback1(null,accs);
						});
						
					},
					function(accs,callback1){
						var query = {id_app:id_app
									,ngay_ct:{$gte:ngay_dn,$lt:ngay}
									,tk:tk
									,tk:{$in:accs}
									,ma_dvcs:ma_dvcs};
						Vsocai.find(query,function(error,pss){
							if(error){
								callback1(error);
								return;
							}
							callback1(null,pss);
							
						});
					}
				],
				function(error,result){
					if(error){
						callback(error);
						return;
					}
					callback(null,result);
				}
			);
		}
	},function(error,results){
		if(error){
			fn(error);
			return;
		}
		var data = results.dn;
		results.ps.forEach(function(r){
			data.push(r);
		});
		var groups = underscore.groupBy(data,function(r){
			return r.tk;
		});
		//
		var keys = underscore.keys(groups);
		async.map(keys,function(key,callback){
			var value = groups[key];
			var r = {};
			r.tk = key;
			r.du_no00 = value.csum("du_no00") + value.csum("ps_no") - value.csum("du_co00") - value.csum("ps_co");
			r.du_no_nt00 = value.csum("du_no_nt00") + value.csum("ps_no_nt") - value.csum("du_co_nt00") - value.csum("ps_co_nt");
			if(r.du_no00<0){
				r.du_co00 = Math.abs(r.du_no00);
				r.du_no00 = 0;
			}else{
				r.du_co00 = 0;
			}
			if(r.du_no_nt00<0){
				r.du_co_nt00 = Math.abs(r.du_no_nt00);
				r.du_no_nt00 = 0;
			}else{
				r.du_co_nt00 = 0;
			}
			callback(null,r);
		},function(error,result){
			if(error){
				fn(error);
				return;
			}
			fn(null,result);
		}
		);
	}
	);
}