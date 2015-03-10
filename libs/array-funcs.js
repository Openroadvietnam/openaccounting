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
