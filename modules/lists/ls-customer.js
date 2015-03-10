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
var model = require("../../models/customer");
var controller = require("../../controllers/controller");
var createdOrUpdated = function(user,obj,next){
	var id_app = user.current_id_app;
	if(!obj.ma_kh || obj.ma_kh==""){
		model.findByIdAndUpdate(obj._id,{$set:{ma_kh:obj._id.toString().toUpperCase()}},function(error,kh){
			if(error) {
				return next(error);
			}else{
				if(kh){
					next(null,kh);
					return;
				}else{
					return next(new Error("customer is not exists"));
				}
			}
			
		});
	}else{
		next(null,obj);
	}
	
}
var customer = function(router){
	var contr = new controller(router,model,"customer",{
		sort:		{ten_kh:1},
		unique:		['ma_kh']
	});
	contr.route();
	contr.created = createdOrUpdated;
	contr.updated = createdOrUpdated;
}
module.exports = customer;
