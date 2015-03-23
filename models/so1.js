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
var validAccount = require("../libs/validator-account");
var validVt = require("../libs/validator-vt");
var validator = require("../libs/validator");
var detailSchema = new Schema({
	ma_vt:{type:String,required:true,uppercase:true},
	ma_dvt:{type:String,required:true},
	
	sl_xuat:{type:Number,default:0,required:true},
	px_gia_dd:{type:Boolean,default:false},
	gia_von:{type:Number,default:0,required:true},
	gia_von_nt:{type:Number,default:0,required:true},
	tien_xuat:{type:Number,default:0,required:true},
	tien_xuat_nt:{type:Number,default:0,required:true},
	
	gia_ban:{type:Number,default:0,required:true},
	gia_ban_nt:{type:Number,default:0,required:true},
	
	tien_hang:{type:Number,default:0,required:true},
	tien_hang_nt:{type:Number,default:0,required:true},
	
	ty_le_ck:{type:Number,default:0,required:true},
	tien_ck:{type:Number,default:0,required:true},
	tien_ck_nt:{type:Number,default:0,required:true},
	
	tien:{type:Number,default:0,required:true},
	tien_nt:{type:Number,default:0,required:true},
	
	
	gia_ban_thuc:{type:Number,default:0,required:true},
	
	ma_bp:{type:String,uppercase:true,default:''},
	ma_phi:{type:String,uppercase:true,default:''},
	ma_hd:{type:String,uppercase:true,default:''},
	ma_dt:{type:String,uppercase:true,default:''},
	ma_nv:{type:String,uppercase:true,default:''},
	ma_lo:{type:String,uppercase:true,default:''},
	line:{type:Number,default:0}
});
detailSchema.validate ={
	ma_vt:validVt.existsVt,
	ma_dvt:validator.existsDvt
}

var so1Schema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String},
	ma_ct:{type:String,default:'SO1',required:true,uppercase:true},
	ma_gd:{type:String,default:'0'},
	so_ct:{type:String,uppercase:true,trim:true},
	ngay_ct:{type:Date,default:Date.now,required:true},
	ma_nt:{type:String,required:'ma_nt is required',default:'VND',trim:true,uppercase:true},
	ty_gia:{type:Number,required:true,min:0,default:1},
	
	trang_thai:{type:String,default:'1'},
	
	ma_kh:{type:String,uppercase:true},
	ma_kho:{type:String,uppercase:true},
	ten_nguoi_nhan:{type:String,required:'Vui lòng nhập tên người nhận'},
	dien_thoai:{type:String,required:'Vui lòng nhập số điện thoại'},
	email:{type:String},
	dia_chi:{type:String,required:'Vui lòng nhập địa chỉ'},
	xa_phuong:{type:String,required:'Vui lòng nhập xã/phường'},
	quan_huyen:{type:String,required:'Vui lòng nhập quận/huyện'},
	tinh_thanh:{type:String,required:'Vui lòng nhập tỉnh/thành'},
	quoc_gia:{type:String,default:'Việt Nam'},
	
	pt_thanh_toan:{type:String},
	

	ty_le_ck_hd:{type:Number,default:0},
	tien_ck_hd:{type:Number,default:0},
	
	
	
	dien_giai:{type:String,default:''},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''},
	details:{type:[detailSchema]}
});
so1Schema.validate ={
	ma_nt:validator.existsNt,
	ngay_ct:validator.unlockBook,
	ma_kh:validator.existsKh,
	ma_kho:validVt.existsKho,
	trang_thai:[
		function(id_app,trang_thai,callback){
			if(trang_thai!="1" && trang_thai!="2" && trang_thai!="3" && trang_thai!="4"&& trang_thai!="5"){
				callback(false);
			}else{
				callback(true);
			}
		}
		,'Các trạng thái:1-đặt hàng,2-xác nhận,3-đang giao,4-đã giao,5-hủy']
}
so1Schema.index({id_app:1,ma_dvcs:1,so_ct:1,ngay_ct:1});
module.exports = mongoose.model('so1',so1Schema);