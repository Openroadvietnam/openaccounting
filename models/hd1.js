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
	tien:{type:Number,default:0,required:true},
	tien_nt:{type:Number,default:0,required:true},
	tk_dt:{type:String,required:true,uppercase:true},
	
	ty_le_ck:{type:Number,default:0,required:true},
	tien_ck:{type:Number,default:0,required:true},
	tien_ck_nt:{type:Number,default:0,required:true},
	tk_ck:{type:String,required:true,uppercase:true},
	
	ma_bp:{type:String,uppercase:true,default:''},
	ma_phi:{type:String,uppercase:true,default:''},
	ma_hd:{type:String,uppercase:true,default:''},
	ma_dt:{type:String,uppercase:true,default:''},
	ma_nv:{type:String,uppercase:true,default:''},
	ma_lo:{type:String,uppercase:true,default:''},
	line:{type:Number,default:0}
});
detailSchema.validate ={
	tk_dt:validAccount.existsTk,
	tk_ck:validAccount.existsTk
}

var hd1Schema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String,required:true},
	ma_ct:{type:String,default:'hd1',required:true,uppercase:true},
	ma_gd:{type:String,default:'0'},
	so_ct:{type:String,required:true,uppercase:true,trim:true},
	ngay_ct:{type:Date,default:Date.now,required:true},
	ma_nt:{type:String,required:'ma_nt is required',default:'VND',trim:true,uppercase:true},
	ty_gia:{type:Number,required:true,min:0,default:1},
	ma_kh:{type:String,uppercase:true,required:true,default:''},
	ma_so_thue:String,
	tk_no:{type:String,uppercase:true,required:true,default:''},
	
	ma_hoa_don:{type:String,default:'',uppercase:true,trim:true},
	ky_hieu_hoa_don:{type:String,default:'',uppercase:true,trim:true},
	so_hd:{type:String,uppercase:true},
	so_seri:{type:String,uppercase:true},
	ngay_hd:{type:Date,uppercase:true},
	ma_thue:{type:String,uppercase:true},
	thue_suat:{type:Number,default:0},
	tk_thue_co:{type:String,uppercase:true},
	
	ten_kh:{type:String,default:''},
	dia_chi:{type:String,default:''},
	ma_so_thue:{type:String,default:''},
	ten_vt:{type:String,default:''},
	
	t_thue:{type:Number,default:0,required:true},//t_thue=t_tien*thue_suat/100
	t_thue_nt:{type:Number,default:0,required:true},//t_thue_nt=t_tien_nt*thue_suat/100
	
	
	dien_giai:{type:String,default:''},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''},
	details:{type:[detailSchema]}
});
hd1Schema.validate ={
	ma_dvcs:validator.existsDvcs,
	ma_nt:validator.existsNt,
	ngay_ct:validator.unlockBook,
	ma_kh:validator.existsKh,
	tk_no:validAccount.existsTk,
	ma_thue:validator.existsVat,
	tk_thue_co:validAccount.existsTk
}
hd1Schema.index({id_app:1,ma_dvcs:1,so_ct:1,ngay_ct:1});
module.exports = mongoose.model('hd1',hd1Schema);