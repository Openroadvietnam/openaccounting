var underscore = require("underscore");
var async = require("async");
Array.prototype.csum = function(field,condition){
	if(!field) return 0;
	var kq =0;
	for(var i=0;i<this.length;i++){
		var r = this[i];
		//
		if(condition){
			var conti = true;
			for(var key in condition){
				var vc = condition[key];
				var vd = r[key];
				if(vc != vd){
					conti = false;
					break;
				}
			}
			if(conti==false){
				break;
			}
		}
		//
		v = r[field];
		if(v){
			kq=kq+Number(v);
		}
	}
	return kq;
}
Array.prototype.groupBy=function(fieldkey,fieldsums,fn){
	var groups = underscore.groupBy(this,function(item){
		return item[fieldkey];
	});
	async.map(underscore.keys(groups)
		,function(key,callback){
			var value = groups[key];
			var r = {};
			r[fieldkey] = key;
			fieldsums.forEach(function(f){
				r[f.name] = value.csum(f.value);
			});
			callback(null,r);
			
		},function(error,result){
			if(error) return fn(error);
			fn(null,result);
		}
	)
}
Array.prototype.joinModel = function(id_app,model,joinFields,fn){
	var array = this;	
	async.map(array,function(a,callback){
		async.map(joinFields,function(join,callback){
			var akey = join.akey;
			var bkey = join.bkey;
			var avalue = a[akey];
			var query = {id_app:id_app};
			query[bkey] = avalue;
			model.findOne(query).lean().exec(function(error,b){
				if(error) return callback(error);
				if(b){
					join.fields.forEach(function(map){
						var name = map.name;
						var value = map.value;
						if(b[value]){
							a[name] = b[value];
						}
					});
				}
				callback(null);
			});
			
		},function(error,rs){
			if(error) return callback(error);
			callback();
		});
	},function(error,kqs){
		if(error) console.log(error);
		fn(array);
	});
}
