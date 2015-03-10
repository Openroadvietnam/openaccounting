var model = require("../../models/sotinhkh");
var qts = require("../../models/qts");
var dmbp = require("../../models/dmbp");
var dmtk = require("../../models/account");
var controller = require("../../controllers/controller");
var async = require("async");
module.exports = function(router){
	var contr = new controller(router,model,'dckhauhaots',{
		sort:{nam:1,thang:1,so_the_ts:1}
	});
	contr.view = function(user,items,fn){
		id_app = user.current_id_app;
		async.parallel({
			ts:function(callback){
				items.joinModel(id_app,qts,[{akey:'so_the_ts',bkey:'so_the_ts',fields:[{name:'ten_ts',value:'ten_ts'}]}],function(kq){
					callback();
				});
			}
		},function(error,rs){
			if(error) return fn(error);
			fn(null,items);
		});
	}
	contr.route();
}
