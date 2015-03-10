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