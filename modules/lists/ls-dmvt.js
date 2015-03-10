var model = require("../../models/dmvt");
var controller = require("../../controllers/controller");
var Dmtk = require("../../models/account");
var Dmdvt = require("../../models/dmdvt");
var async =require("async");
var arrayfuncs = require("../../libs/array-funcs");
var fs = require("fs")
var counter = require("../../models/counter");
module.exports = function(router){
	var contr = new controller(router,model,'dmvt',{
		sort:{ma_vt:1},
		unique:['ma_vt']
	});
	contr.route();
	contr.creating = function(user,obj,next){
		if(!obj.ma_vt){
			id_app = user.current_id_app;
			counter.getNextSequence(id_app,"DMVT","ma_vt",function(error,sequence){
				if(error) sequence = 0
				//
				sequence = sequence.toString();
				obj.ma_vt = "SP" + '00000000'.substring(0,8-sequence.length) + sequence
				next(null,obj);
			});
		}else{
			next(null,obj);
		}
		
	}
	contr.updating = function(user,data,obj,next){ 
		if(!data.ma_vt){
			data.ma_vt = obj.ma_vt;
		}
		next(null,data,obj);
	}
	contr.view = function(user,items,fn){
		id_app = user.current_id_app;
		async.parallel([
			function(callback){
				items.joinModel(id_app,Dmtk,[{akey:'tk_vt',bkey:'tk',fields:[{name:'ten_tk_vt',value:'ten_tk'}]},
							{akey:'tk_dt',bkey:'tk',fields:[{name:'ten_tk_dt',value:'ten_tk'}]},
							{akey:'tk_gv',bkey:'tk',fields:[{name:'ten_tk_gv',value:'ten_tk'}]},
							{akey:'tk_tl',bkey:'tk',fields:[{name:'ten_tk_tl',value:'ten_tk'}]},
							{akey:'tk_dl',bkey:'tk',fields:[{name:'ten_tk_dl',value:'ten_tk'}]}
					]
				,function(rs){
					callback(null,rs);
				});
			},
			function(callback){
				items.forEach(function(r){
					if(!r.picture){
						r.picture ="/getfile/others/noimage.png"
						r.picture_thumb = "/getfile/others/noimage.png"
					}else{
						var p =  r.picture.split(".")
						r.picture_thumb = r.picture + ".thumb." +  p[p.length-1]
					}
					
					if(r.picture2){
						var p =  r.picture2.split(".")
						r.picture2_thumb = r.picture2 + ".thumb." +  p[p.length-1]
					}
					if(r.picture3){
						var p =  r.picture3.split(".")
						r.picture3_thumb = r.picture3 + ".thumb." +  p[p.length-1]
					}
					if(r.picture4){
						var p =  r.picture4.split(".")
						r.picture4_thumb = r.picture4 + ".thumb." +  p[p.length-1]
					}
					if(r.picture5){
						var p =  r.picture5.split(".")
						r.picture5_thumb = r.picture5 + ".thumb." +  p[p.length-1]
					}
					
					
				});
				items.joinModel(id_app,Dmdvt,[{akey:'ma_dvt',bkey:'ma_dvt',fields:[{name:'ten_dvt',value:'ten_dvt'}]}],function(rs){
					callback(null,rs);
				});
			}
			
		],function(error,results){
			fn(null,items);
		});
	}
}