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
var Account = require("../models/account");
exports.checkAccAndCust = function(id_app,tk,ma_kh,fn){
	if(!ma_kh){
		ma_kh ="";
	}
	if(ma_kh.trim()!=""){
		return fn();
	}
	Account.findOne({id_app:id_app,tk:tk},{tk_cn:1,_id:0},function(error,acc){
		if(error) return fn(error);
		if(!acc) return fn(new Error("Tài khoản " + tk + " không tồn tại"));
		if(acc.tk_cn==true){
			return fn(new Error("Tài khoản " + tk + " yêu cầu một mã khách"));
		}
		return fn();
	});
}