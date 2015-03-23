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
	tk_no:{type:String,required:true,uppercase:true},
	tien:{type:Number,default:0,required:true},
	tien_nt:{type:Number,default:0,required:true},
	
	ma_kh:{type:String,uppercase:true,default:''},
	ma_bp:{type:String,uppercase:true,default:''},
	ma_phi:{type:String,uppercase:true,default:''},
	ma_hd:{type:String,uppercase:true,default:''},
	ma_dt:{type:String,uppercase:true,default:''},
	ma_nv:{type:String,uppercase:true,default:''},
	ma_lo:{type:String,uppercase:true,default:''},
	line:{type:Number,default:0}
});
detailSchema.validate ={
	tk_no:validAccount.existsTk
}
var vatvaoSchema = new Schema({
	ma_hoa_don:{type:String,default:'',uppercase:true,trim:true},
	ky_hieu_hoa_don:{type:String,default:'',required:true,uppercase:true,trim:true},
	ma_tc:{type:String,default:'',required:true,uppercase:true,trim:true},
	so_hd:{type:String,default:'',required:true,uppercase:true,trim:true},
	so_seri:{type:String,default:'',required:true,uppercase:true,trim:true},
	ngay_hd:{type:Date,required:true},
	
	t_tien:{type:Number,default:0,required:true},
	t_tien_nt:{type:Number,default:0,required:true},
	
	ma_thue:{type:String,required:true,uppercase:true},
	thue_suat:{type:Number,default:0,required:true},
	tk_thue_no:{type:String,required:true},
	tk_du_thue:{type:String,required:true},
	t_thue:{type:Number,default:0,required:true},//t_thue=t_tien*thue_suat/100
	t_thue_nt:{type:Number,default:0,required:true},//t_thue_nt=t_tien_nt*thue_suat/100
	
	t_hd:{type:Number,default:0,required:true},//t_hd=t_tien+t_thue
	t_hd_nt:{type:Number,default:0,required:true},//t_hd_nt = t_tien_nt + t_thue_nt
	
	ma_kh:{type:String,uppercase:true,default:''},
	ten_kh:{type:String,default:''},
	dia_chi:{type:String,default:''},
	ma_so_thue:{type:String,default:''},
	
	ten_vt:{type:String,default:''},
	line:{type:Number,default:0}
	
});
vatvaoSchema.validate = {
	tk_thue_no:validAccount.existsTk,
	tk_du_thue:validAccount.existsTk,
	ma_kh:validator.existsKh,
	ma_thue:validator.existsVat
}

var pn2Schema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String,required:true},
	ma_ct:{type:String,default:'pn2',required:true,uppercase:true},
	ma_gd:{type:String,default:'0'},
	so_ct:{type:String,required:true,uppercase:true,trim:true},
	ngay_ct:{type:Date,default:Date.now,required:true},
	ma_nt:{type:String,required:'ma_nt is required',default:'VND',trim:true,uppercase:true},
	ty_gia:{type:Number,required:true,min:0,default:1},
	ma_kh:{type:String,uppercase:true,required:true,default:''},
	tk_co:{type:String,uppercase:true,required:true,default:''},
	dien_giai:{type:String,default:''},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''},
	details:{type:[detailSchema]},
	vatvaos:[vatvaoSchema]
});
pn2Schema.validate ={
	ma_dvcs:validator.existsDvcs,
	ma_nt:validator.existsNt,
	ngay_ct:validator.unlockBook,
	ma_kh:validator.existsKh,
	tk_co:validAccount.existsTk
}
pn2Schema.index({id_app:1,ma_dvcs:1,so_ct:1,ngay_ct:1});
module.exports = mongoose.model('pn2',pn2Schema);