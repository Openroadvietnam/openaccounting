var sophanbokh = require("../models/sophanbokh");
var hspbts = require("../models/hspbts");
var sotinhkh = require("../models/sotinhkh");
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(kqtinhkh,fn){
	sophanbokh.remove({id_ts:kqtinhkh.id_ts,thang:kqtinhkh.thang,nam:kqtinhkh.nam},function(error){
		if(error) return fn(error);
		hspbts.find({id_app:kqtinhkh.id_app,so_the_ts:kqtinhkh.so_the_ts,thang:kqtinhkh.thang,nam:kqtinhkh.nam}).lean().exec(function(error,hss){
			if(error) return fn(error);
			var m = hss.csum("he_so");
			if(m!=0){
				hss.forEach(function(hs){
					underscore.extend(hs,kqtinhkh);
					hs.gia_tri_kh_ky = Math.round((hs.he_so/m) * kqtinhkh.gia_tri_kh_ky,0);
					delete hs["_id"];
				});
			}else{
				hss =[kqtinhkh];
			}
			sophanbokh.create(hss,function(error){
				if(error) return fn(error);
				fn(null,hss);
			})
			
		});
	});
}