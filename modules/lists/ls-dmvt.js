/*Copyright (C) 2015  Sao Tien Phong (http://saotienphong.com.vn)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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