var fs = require("fs");
var async = require("async");
exports.init = function(id_app,fn){
	var files = fs.readdirSync("data");
	async.map(files,function(file,callback){
		if(file.substr(-3)==".js"){
			var data = require("../data/" + file).data;
			var model = require("../models/" + file);
			async.map(data,function(r,callback){
				r.id_app = id_app;
				model.create(r,function(error){
					if(error) return callback(error);
					callback();
				});
			},function(error,rs){
				callback(error,rs);
			});
		}else{
			callback()
		}
	},function(error){
		fn(error);
	});
}