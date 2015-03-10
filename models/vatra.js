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
var taxSchema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String,required:true},
	id_ct:{type:String,required:true},
	ma_ct:{type:String,required:true},
	ma_gd:{type:String,default:'0'},
	ngay_ct:{type:Date,required:true},
	so_ct:{type:String,required:true},
	
	ma_hoa_don:{type:String,default:'',uppercase:true,trim:true},
	ky_hieu_hoa_don:{type:String,default:'',required:true,uppercase:true,trim:true},
	so_hd:{type:String,default:'',required:true,uppercase:true,trim:true},
	so_seri:{type:String,default:'',required:true,uppercase:true,trim:true},
	ngay_hd:{type:Date,required:true},
	
	ma_nt:{type:String,default:'VND',required:true},
	ty_gia:{type:Number,default:1},
	
	t_tien:{type:Number,default:0,required:true},
	t_tien_nt:{type:Number,default:0,required:true},
	
	ma_thue:{type:String,required:true},
	thue_suat:{type:Number,default:0,required:true},
	tk_thue_co:{type:String,required:true},
	tk_du_thue:{type:String,required:true},
	t_thue:{type:Number,default:0,required:true},//t_thue=t_tien*thue_suat/100
	t_thue_nt:{type:Number,default:0,required:true},//t_thue_nt=t_tien_nt*thue_suat/100
	
	t_hd:{type:Number,default:0,required:true},//t_hd=t_tien+t_thue
	t_hd_nt:{type:Number,default:0,required:true},//t_hd_nt = t_tien_nt + t_thue_nt
	
	ma_kh:{type:String,default:''},
	ten_kh:{type:String,default:''},
	dia_chi:{type:String,default:''},
	ma_so_thue:{type:String,default:''},
	ten_vt:{type:String,default:''},
	
	status:{type:String,required:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
taxSchema.index({id_app:1,ma_dvcs:1,id_ct:1,ngay_hd:1,ngay_ct:1,ma_thue:1});
module.exports = mongoose.model("vatra",taxSchema);