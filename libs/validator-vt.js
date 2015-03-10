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
var Dmvt = require("../models/dmvt");
var Dmkho = require("../models/dmkho");
exports.existsVt = [function(id_app,ma_vt,callback){
	if(!ma_vt || ma_vt.trim()==""){
		callback(true);
		return;
	}
	Dmvt.findOne({id_app:id_app,ma_vt:ma_vt},{ma_vt:1},function(error,vt){
		if(error || !vt){
			callback(false);
		}else{
			callback(true);
		}
	});
},"Mã vật tư {VALUE} không tồn tại"];
exports.existsKho = [function(id_app,ma_kho,callback){
	if(!ma_kho || ma_kho.trim()==""){
		callback(true);
		return;
	}
	Dmkho.findOne({id_app:id_app,ma_kho:ma_kho},{ma_kho:1},function(error,kho){
		if(error || !kho){
			callback(false);
		}else{
			callback(true);
		}
	});
},"Mã kho {VALUE} không tồn tại"];