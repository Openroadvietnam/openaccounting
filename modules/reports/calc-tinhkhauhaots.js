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
var async = require("async");
var tinhkhauhaots = require("../../libs/tinhkhauhaots");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"tinhkhauhaots",function(req,callback){
		var condition = req.query;
		if(!condition.nam || !condition.thang){
			return callback("Chức năng này yêu cầu các tham số: nam,thang");
		}
		tinhkhauhaots(condition,function(error,results){
			if(error) return callback(error);
			callback(null,results);
		});
	});
}