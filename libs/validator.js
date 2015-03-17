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
var Customer = require("../models/customer");
var Dvcs = require("../models/dvcs");
var Dmdvt = require("../models/dmdvt");
var Vat = require("../models/vat");
var Currency = require("../models/currency");
var Dmbp = require("../models/dmbp");
var Dmloaits = require("../models/dmloaits");
var Dmnguonvon = require("../models/dmnguonvon");
var Dmtanggiamts = require("../models/dmtanggiamts");
var app = require("../models/app");
//validator
exports.unlockBook = [function(id_app,ngay_ct,callback){
	if(!ngay_ct) return callback(true);
	app.findOne({_id:id_app},{ngay_ks:1,_id:0},function(error,r){
		if(error || !r) return callback(false);
		if(r.ngay_ks.getTime() >= ngay_ct.getTime()) return callback(false);
		callback(true);
	});
},'Đã khóa sổ'];
exports.existsKh = [function(id_app,kh,callback){
	if(!kh || kh.trim()==""){
		return callback(true);
	}
	Customer.findOne({id_app:id_app,ma_kh:kh},{ma_kh:1},function(error,cust){
		if(error || !cust){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Mã khách ({PATH}) {VALUE} không tồn tại"];
exports.existsDvcs = [function(id_app,ma_dvcs,callback){
	if(!ma_dvcs || ma_dvcs.trim()==""){
		return callback(true);
	}
	Dvcs.findOne({id_app:id_app,_id:ma_dvcs},function(error,dvcs){
		if(error || !dvcs){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Mã đơn vị cơ sở ({PATH}) {VALUE} không tồn tại"];
exports.existsNt = [function(id_app,ma_nt,callback){
	if(!ma_nt || ma_nt.trim()==""){
		callback(true);
		return;
	}
	Currency.findOne({id_app:id_app,ma_nt:ma_nt},function(error,nt){
		if(error || !nt){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Mã ngoại tệ ({PATH}) {VALUE} không tồn tại"];

exports.existsDvt = [function(id_app,ma_dvt,callback){
	if(!ma_dvt || ma_dvt.trim()==""){
		callback(true);
		return;
	}
	Dmdvt.findOne({id_app:id_app,ma_dvt:{$regex:"^" + ma_dvt + "$",$options:'i'}},function(error,dvt){
		if(error || !dvt){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Mã đơn vị tính ({PATH}) {VALUE} không tồn tại"];

exports.existsVat = [function(id_app,ma_thue,callback){
	if(!ma_thue || ma_thue.trim()==""){
		callback(true);
		return;
	}
	Vat.findOne({id_app:id_app,ma_thue:ma_thue},function(error,v){
		if(error || !v){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Mã thuế ({PATH}) {VALUE} không tồn tại"];
exports.existsBp = [function(id_app,ma_bp,callback){
	if(!ma_bp || ma_bp.trim()==""){
		callback(true);
		return;
	}
	Dmbp.findOne({id_app:id_app,ma_bp:ma_bp},function(error,v){
		if(error || !v){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Mã bộ phận ({PATH}) {VALUE} không tồn tại"];
exports.existsLts = [function(id_app,ma_loai_ts,callback){
	if(!ma_loai_ts || ma_loai_ts.trim()==""){
		callback(true);
		return;
	}
	Dmloaits.findOne({id_app:id_app,ma_loai_ts:ma_loai_ts},function(error,v){
		if(error || !v){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Mã loại tài sản ({PATH}) {VALUE} không tồn tại"];
exports.existsNguonvon = [function(id_app,ma_nguon_von,callback){
	if(!ma_nguon_von || ma_nguon_von.trim()==""){
		callback(true);
		return;
	}
	Dmnguonvon.findOne({id_app:id_app,ma_nguon_von:ma_nguon_von},function(error,v){
		if(error || !v){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Mã nguồn vốn ({PATH}) {VALUE} không tồn tại"];
exports.existsTgts = [function(id_app,ma_tang_giam_ts,callback){
	if(!ma_tang_giam_ts || ma_tang_giam_ts.trim()==""){
		callback(true);
		return;
	}
	Dmtanggiamts.findOne({id_app:id_app,ma_tang_giam_ts:ma_tang_giam_ts},function(error,v){
		if(error || !v){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Mã tăng giảm tài sản ({PATH}) {VALUE} không tồn tại"];