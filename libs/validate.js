var async = require("async");
var underscore = require("underscore")
var valid = function(obj,next,id_app){
	if(!id_app){
		id_app = obj.id_app;
	}
	if(obj.schema.validate){
		async.map(underscore.keys(obj.schema.validate),function(key,callback){
			var validField = obj.schema.validate[key];
			
			var value = obj[key];
			if(!value) return callback();
			var validFunc = validField[0];
			var msg = validField[1];
			validFunc(id_app,value,function(valid){
				if(valid==false){
					msg = msg.replace("{PATH}",key);
					msg = msg.replace("{VALUE}",value);
					return callback(msg);
				}else{
					return callback();
				}
			});
		},function(error,results){
			if(error) return next(error);
			next();
		});
	}else{
		next();
	}
}
module.exports = function(obj,next){
	var id_app = obj.id_app;
	valid(obj,function(error){
		if(error) return next(error);
		//
		var valid_path = [];
		for(var key in obj.schema.paths){
			var path = obj.schema.paths[key];
			if(path.schema && path.schema.validate){
				var obj_d = obj.get(key);
				if(underscore.isArray(obj_d)){
					obj_d.forEach(function(o){
						valid_path.push(o);
					});
				}else{
					valid_path.push(obj_d);
				}
			}
		}
		if(valid_path.length>0){
			async.each(valid_path,function(p,callback){
				valid(p,function(error){
					if(error) return callback(error);
					callback();
				},id_app);
				
			},function(error){
				if(error) return next(error);
				next();
			});
		}else{
			next();
		}
	});
	
	
}