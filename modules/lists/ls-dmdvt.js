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
var model = require("../../models/dmdvt");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'dmdvt',{
		sort:{ma_dvt:1},
		unique:['ma_dvt']
	});
	contr.creating = function(user,obj,next){
		if(!obj.ma_dvt){
			obj.ma_dvt = obj.ten_dvt
		}
		next(null,obj);
		
	}
	contr.updating = function(user,data,obj,next){ 
		if(!data.ma_dvt){
			data.ma_dvt = data.ten_dvt
		}
		next(null,data,obj);
	}
	contr.route();
}