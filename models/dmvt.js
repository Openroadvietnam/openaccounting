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
var dmvtSchema = new Schema({
	id_app:{type:String,required:true},
	ma_vt:{type:String,required:"Mã vật tư không được trống",uppercase:true},
	ma_vt2:{type:String},
	ten_vt:{type:String,required:"Tên vật tư không được trống"},
	ma_dvt:{type:String,required:"Mã đơn vị tính không được trống"},
	ma_lvt:{type:String,required:false},
	ma_nvt:{type:String,required:false},
	gia_xuat:{type:String,default:'1'},
	tk_vt:{type:String,default:'1561'},
	tk_dt:{type:String},
	tk_gv:{type:String},
	tk_dl:{type:String},
	tk_tl:{type:String},
	gia_ban_le:{type:Number,default:0},
	ty_le_ck:{type:Number,default:0},
	tien_ck:{type:Number,default:0},
	ma_thue:{type:String},
	picture_slide:{type:String},
	picture:{type:String},
	picture2:{type:String},
	picture3:{type:String},
	picture4:{type:String},
	picture5:{type:String},
	picture6:{type:String},
	mieu_ta:{type:String},
	mieu_ta_chi_tiet:{type:String},
	khuyen_mai:{type:String},
	
	hot:{type:Boolean},
	
	tinh_trang:{type:String},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmvtSchema.validate ={
	tk_vt:validAccount.existsTk,
	ma_dvt:validator.existsDvt,
	ma_thue:validator.existsVat,
	gia_xuat:[
		function(id_app,gx,callback){
			if(gx!="1" && gx!="2" && gx!="3"){
				callback(false);
			}else{
				callback(true);
			}
		}
		,"Phương pháp tính giá xuất: 1- Trung bình tháng, 2- Nhập trước xuất trước, 3- Đích danh"
	],
	tinh_trang:[
		function(id_app,gx,callback){
			if(gx!="1" && gx!="2" && gx!="3"){
				callback(false);
			}else{
				callback(true);
			}
		}
		,"Tình trạng: 1- Đang có hàng, 2- Sắp có hàng, 3- Hết hàng"
	]
}
dmvtSchema.index({id_app:1,ma_vt:1,ten_vt:1,ma_nvt:1});
var model = mongoose.model("dmvt",dmvtSchema);
model.referenceKeys ={
	ma_vt:[
		{model:"sokho",key:'ma_vt',error:'Vật tư {{VALUE}} đã phát sinh dữ liệu'},
		{model:"cdvt",key:'ma_vt',error:'Vật tư {{VALUE}} đã phát sinh dữ liệu'}
		//,{model:hd2,key:'ma_vt',childDoc:'details'}
	]
}
module.exports = model;