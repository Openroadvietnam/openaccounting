
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
exports.isTkcn = [function(id_app,tk,callback){
	if(!tk || tk.trim()==""){
		callback(true);
		return;
	}
	Account.findOne({id_app:id_app,tk:tk},{tk_cn:1,_id:0,loai_tk:1},function(error,acc){
		if(error || !acc || acc.loai_tk==0){
			callback(false);
		}else{
			callback(acc.tk_cn);
		}
	});
},"Tài khoản {VALUE} không tồn tại hoặc không phải là tài khoản công nợ"];
exports.isNotTkcn = [function(id_app,tk,callback){
	if(!tk || tk.trim()==""){
		callback(true);
		return;
	}
	Account.findOne({id_app:id_app,tk:tk},{tk_cn:1,_id:0,loai_tk:1},function(error,acc){
		if(error || !acc || acc.loai_tk==0){
			callback(false);
		}else{
			callback(!acc.tk_cn);
		}
	});
}, "Tài khoản {VALUE} không tồn tại hoặc không phải là tài khoản công nợ"];
exports.existsTk = [function(id_app,tk,callback){
	if(!tk || tk.trim()==""){
		callback(true);
		return;
	}
	Account.findOne({id_app:id_app,tk:tk},{tk:1,loai_tk:1},function(error,acc){
		if(error) console.log(error);
		if(!acc) console.log("not found " + tk + " of app " + id_app);
		if(error || !acc || acc.loai_tk==0){
			callback(false);
		}else{
			callback(true);
		}
	});
},"Tài khoản {VALUE} không tồn tại"];

exports.existsAnyTk = [function(id_app,tk,callback){
	if(!tk || tk.trim()==""){
		callback(true);
		return;
	}
	Account.findOne({id_app:id_app,tk:tk},{tk:1},function(error,acc){
		if(error || !acc || acc.loai_tk==0){
			callback(false);
		}else{
			callback(true);
		}
	});
},"Tài khoản {VALUE} không tồn tại"];