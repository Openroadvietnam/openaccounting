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
var dmkcSchema = new Schema({
	id_app:{type:String,required:true},
	stt:{type:Number,required:true},
	ten_bt:{type:String,required:true},
	loai_kc:{type:String,required:true},
	
	tk_chuyen:{type:String,required:true},
	tk_nhan:{type:String,required:true},
	
	phi_yn:{type:Boolean,default:false},
	dt_yn:{type:Boolean,default:false},
	bp_yn:{type:Boolean,default:false},
	sp_yn:{type:Boolean,default:false},
	hd_yn:{type:Boolean,default:false},
	kh_yn:{type:Boolean,default:false},
	
	ps_yn:{type:Boolean,default:true},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmkcSchema.validate ={
	tk_chuyen:validAccount.existsTk,
	tk_nhan:validAccount.existsTk,
	loai_kc:[
		function(id_app,loai,callback){
			if(loai!="1" && loai!="2" && loai!="3"){
				callback(false);
			}else{
				callback(true);
			}
		}
		,"Loại kết chuyển: 1- Kết chuyển số dư bên nợ, 2- Kết chuyển số dư bên có"
	]
}
dmkcSchema.index({id_app:1,stt:1,tk_chuyen:1,tk_nhan:1});
module.exports = mongoose.model("dmkc",dmkcSchema);