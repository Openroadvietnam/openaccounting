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
var kbmlcttgtSchema = new Schema({
	id_app:{type:String,required:true},
	stt:{type:Number,required:true},
	ma_so:{type:String,required:true},
	chi_tieu:{type:String,required:true},
	thuyet_minh:{type:String},

	print:{type:Boolean,default:true},
	bold:{type:Boolean,default:false},
	phan_loai:{type:Number,require:true},
	cach_tinh:{type:String,required:true},
	tk_no:[String],
	tk_co:[String],
	giam_tru_no:{type:Boolean,default:false},
	giam_tru_co:{type:Boolean,default:false},
	khong_am:{type:Boolean,default:false},
	bu_tru_cong_no:{type:Boolean,default:false},
	cong_thuc:{type:String},
	
	cong_thuc_so_kn:{type:String},
	cong_thuc_so_kn_nt:{type:String},
	cong_thuc_so_kt:{type:String},
	cong_thuc_so_kt_nt:{type:String},
	
	so_kn:{type:Number},
	so_kt:{type:Number},
	so_kn_nt:{type:Number},
	so_kt_nt:{type:Number},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
kbmlcttgtSchema.validate =  {
	cach_tinh:[function(id_app,value,callback){
			if(value=='1' || value=='2'|| value=='3'){
				callback(true);
			}else{
				callback(false);
			}
		},'Cách tính:1-Mã số,2-Tinh theo số phát sinh,3-Tinh theo số dư đầu kỳ,4-Tính theo số dư nợ đầu kỳ,5-Tính theo số dư có đầu kỳ,6-Tính theo số dư cuối kỳ,7-Tính theo số dư nợ cuối kỳ,8-Tính theo số dư có cuối kỳ'
	],
	phan_loai:[function(id_app,value,callback){
			if(value=='1' || value=='2'){
				callback(true);
			}else{
				callback(false);
			}
		},'Phân loại:1-chi,2-thu'
	]
};
kbmlcttgtSchema.index({id_app:1,stt:1,ma_so:1});
module.exports = mongoose.model("kbmlcttgt",kbmlcttgtSchema);