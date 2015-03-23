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
var validator = require("../libs/validator");
var detailSchema = new Schema({
	ma_nguon_von:{type:String,uppercase:true,default:''},
	nguyen_gia:{type:Number,default:0,required:true},
	gia_tri_da_kh:{type:Number,default:0,required:true},
	gia_tri_con_lai:{type:Number,default:0,required:true},
	gia_tri_kh_ky:{type:Number,default:0,required:true},
	line:{type:Number,default:0}
});
detailSchema.validate ={
	ma_nguon_von:validator.existsNguonvon
}
var phutungSchema = new Schema({
	ten_phu_tung:{type:String,required:true,default:''},
	so_luong:{type:Number,default:0,required:true},
	gia_tri:{type:Number,default:0,required:true},
	
	line:{type:Number,default:0}
});
var qtsSchema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String,required:true},
	ma_ct:{type:String,default:'qts',required:true,uppercase:true},
	ma_gd:{type:String,default:'0'},
	so_ct:{type:String,required:true,uppercase:true,trim:true},
	ngay_ct:{type:Date,default:Date.now,required:true},
	ma_nt:{type:String,required:'ma_nt is required',default:'VND',trim:true,uppercase:true},
	ty_gia:{type:Number,required:true,min:0,default:1},
	
	so_the_ts:{type:String,required:true,uppercase:true,trim:true},
	ngay_tang:{type:Date,default:Date.now,required:true},
	ten_ts:{type:String,required:true},
	ma_loai_ts:{type:String,uppercase:true,required:true},
	ma_tang_giam_ts:{type:String,uppercase:true,required:true},
	ma_bp:{type:String,uppercase:true,required:true},
	
	pp_tinh_kh:{type:String,default:'1'},
	ngay_kh:{type:Date,default:Date.now,required:true},
	so_ky_kh:{type:Number,default:0,required:true},
	lam_tron_kh:{type:Number,default:0},
	
	tinh_kh_gia_tri_con_lai:{type:Boolean,default:true},
	
	tk_ts:{type:String,uppercase:true,required:"Tài khoản tài sản(tk_ts) không được trống"},
	tk_kh:{type:String,uppercase:true,required:"Tài khoản khấu hao(tk_kh) không được trống"},
	tk_cp:{type:String,uppercase:true,required:"Tài khoản chi phí(tk_cp) không được trống"},
	
	so_hieu:String,
	thong_tin_ky_thuat:String,
	nuoc_san_xuat:String,
	nam_san_xuat:String,
	ngay_su_dung:{type:Date},
	
	ngay_dinh_chi:{type:Date},
	lu_do_dinh_chi:{type:String},
	
	ngay_giam_ts:{type:Date},
	ngay_thoi_kh:{type:Date},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''},
	details:{type:[detailSchema]},
	phutungs:{type:[phutungSchema]}
});
qtsSchema.validate ={
	ma_dvcs:validator.existsDvcs,
	ma_nt:validator.existsNt,
	//ngay_ct:validator.unlockBook,
	
	ma_bp:validator.existsBp,
	tk_ts:validAccount.existsTk,
	tk_cp:validAccount.existsTk,
	tk_kh:validAccount.existsTk,
	ma_loai_ts:validator.existsLts,
	ma_tang_giam_ts:validator.existsTgts,
	pp_tinh_kh:[function(id_app,value,callback){
			if(value=='1'){
				callback(true);
			}else{
				callback(false);
			}
		}
		,"Phương pháp tính khấu hao(pp_tinh_kh): 1-Đường thẳng"],
	ma_gd:[function(id_app,value,callback){
			if(value=='1' || value=='2'){
				callback(true);
			}else{
				callback(false);
			}
		}
		,"Kiểu (ma_gd): 1-tài sản,2-công cụ, dụng cụ"]
}

qtsSchema.index({id_app:1,ma_dvcs:1,so_ct:1,ngay_ct:1,so_the_ts:1});
var model = mongoose.model('qts',qtsSchema);
model.exists = [function(id_app,so_the_ts,callback){
	if(!so_the_ts || so_the_ts.trim()==""){
		callback(true);
		return;
	}
	model.findOne({id_app:id_app,so_the_ts:so_the_ts},function(error,v){
		if(error || !v){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Số thẻ tài sản ({PATH}) {VALUE} không tồn tại"];
module.exports = model;