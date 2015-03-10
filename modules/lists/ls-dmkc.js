var model = require("../../models/dmkc");
var controller = require("../../controllers/controller");
var Dmtk = require("../../models/account");
var async =require("async");
var arrayfuncs = require("../../libs/array-funcs");

module.exports = function(router){
	var contr = new controller(router,model,'dmkc',{
		sort:{stt:1},
		unique:['stt']
	});
	contr.route();
	contr.view = function(user,items,fn){
		id_app = user.current_id_app;
		async.parallel([
			function(callback){
				items.joinModel(id_app,Dmtk,[{akey:'tk_chuyen',bkey:'tk',fields:[{name:'ten_tk_chuyen',value:'ten_tk'}]},
							{akey:'tk_nhan',bkey:'tk',fields:[{name:'ten_tk_nhan',value:'ten_tk'}]}
					]
				,function(rs){
					callback(null,rs);
				});
			}
			
		],function(error,results){
			fn(null,items);
		});
	}
}