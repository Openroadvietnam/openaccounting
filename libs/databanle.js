var pbl = require("../models/pbl"),so1 = require("../models/so1"),async = require("async")
module.exports = function(condition,callback){
	async.parallel({
		pbl:function(callback){
			pbl.find(condition).lean().exec(function(error,rs){
				if(error) return callback(error);
				callback(null,rs)
			})
		},
		so:function(callback){
			condition.trang_thai ={$in:['3','4']}
			so1.find(condition).lean().exec(function(error,rs){
				if(error) return callback(error);
				callback(null,rs)
				
			})
		}
	},function(error,rs){
		if(error) callback(error);
		rs.so.forEach(function(r){
			rs.pbl.push(r);
		})
		callback(null,rs.pbl)
	})
}