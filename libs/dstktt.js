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
module.exports = function(id_app,tk,fn){
	var query ={id_app:id_app,tk_cn:false,tk:tk};
	Account.find(query,{tk:1,_id:0},function(error,accs){
		if(error) {
			fn(error);
			return;
		}
		var kqs =[];
		accs.forEach(function(acc){
			kqs.push(acc.tk);
		});
		fn(null,kqs);
	});
}