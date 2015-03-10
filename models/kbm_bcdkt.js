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
var kbmBcdktSchema = new Schema({
	id_app:{type:String,required:true},
	stt:{type:Number,required:true},
	ma_so:{type:String,required:true},
	chi_tieu:{type:String,required:true},
	thuyet_minh:{type:String},
	phan_loai:{type:String,required:true},
	ngoai_bang:{type:Boolean,default:false},
	print:{type:Boolean,default:true},
	bold:{type:Boolean,default:false},
	
	cach_tinh:{type:String,required:true},
	tk:{type:String},
	bu_tru_cong_no:{type:Boolean,default:false},
	khong_am:{type:Boolean,default:false},
	cong_thuc:{type:String},
	cong_thuc_so_dn:{type:String},
	cong_thuc_so_ck:{type:String},
	cong_thuc_so_dn_nt:{type:String},
	cong_thuc_so_ck_nt:{type:String},
	
	so_dn:{type:Number},
	so_ck:{type:Number},
	so_dn_nt:{type:Number},
	so_ck_nt:{type:Number},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
kbmBcdktSchema.validate =  {
	tk: validAccount.existsAnyTk,
	phan_loai:[function(id_app,value,callback){
			if(value=='1' || value=='2'){
				callback(true);
			}else{
				callback(false);
			}
		},'Phân loại:1-tài sản,2-nguồn vốn'
	],
	cach_tinh:[function(id_app,value,callback){
			if(value=='1' || value=='2'|| value=='3' || value=='4'){
				callback(true);
			}else{
				callback(false);
			}
		},'Cách tính:1-Mã số,2-Số dư tài khoản,3-Số dư bên nợ,4-Số dư bên có'
	]
};
kbmBcdktSchema.index({id_app:1,stt:1,ma_so:1});
module.exports = mongoose.model("kbmbcdkt",kbmBcdktSchema);