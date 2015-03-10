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
var right = require("../models/right");
var app = require("../models/app");
var underscore = require("underscore")
exports.hasRight = function(id_app,email,module,action,callback){
	if(!id_app){
		return callback(null,true);
	}
	app.findOne({_id:id_app},function(error,app){
		if(error) return callback(error,false);
		if(!app) return callback("Công ty này không tồn tại",false);
		if(app.user_created==email) return callback(null,true);
		
		if(!app.participants) return callback("Bạn không có quyền truy cập công ty này",false);
		var participant = underscore.find(app.participants,function(p){
			return p.email == email;
		});
		if(!participant) return callback("Bạn không có quyền truy cập công ty này",false);
		
		right.findOne({id_app:id_app,email:email,module:module},function(error,result){
			if(error) return callback(error,false);
			if(!result){
				return callback("Bạn không có quyền đối với tính năng này",false);
			}
			callback(null,result[action]);
		});
	});
	
} 