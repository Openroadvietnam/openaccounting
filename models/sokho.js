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
var sokhoSchema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String,required:true},
	id_ct:{type:String,required:true},
	ma_ct:{type:String,required:true,uppercase:true},
	ma_gd:{type:String,default:'0'},
	ngay_ct:{type:Date,required:true},
	so_ct:{type:String,required:true,uppercase:true},
	nxt:{type:Number,required:true},
	ma_nt:{type:String,default:'VND',required:true,uppercase:true},
	ty_gia:{type:Number,default:1},
	
	ma_vt:{type:String,required:true,uppercase:true},
	ma_dvt:{type:String},
	ma_kho:{type:String,required:true,uppercase:true},
	
	sl_nhap:{type:Number,default:0},
	sl_xuat:{type:Number,default:0},
	
	he_so_qd:{type:Number,default:1},
	sl_nhap_qd:{type:Number,default:0},
	sl_xuat_qd:{type:Number,default:0},
	pn_gia_tb:{type:Boolean,default:false},
	px_gia_dd:{type:Boolean,default:false},
	
	gia_von_nt:{type:Number,default:0},
	gia_von:{type:Number,default:0},
	
	tien_hang_nt:{type:Number,default:0},
	tien_hang:{type:Number,default:0},
	ty_le_ck:{type:Number,default:0,required:true},
	tien_ck_nt:{type:Number,default:0},
	tien_ck:{type:Number,default:0},
	tien_nhap_nt:{type:Number,default:0},
	tien_nhap:{type:Number,default:0},
	
	tien_xuat:{type:Number,default:0,required:true},
	tien_xuat_nt:{type:Number,default:0,required:true},
	
	gia_ban:{type:Number,default:0,required:true},
	gia_ban_nt:{type:Number,default:0,required:true},
	tien:{type:Number,default:0,required:true},
	tien_nt:{type:Number,default:0,required:true},
	
	
	
	
	tk_vt:{type:String,uppercase:true},
	tk_gv:{type:String,uppercase:true},
	
	tk_tl:{type:String,uppercase:true},
	tk_dt:{type:String,uppercase:true},
	tk_ck:{type:String,uppercase:true},
	
	ma_kh:{type:String,uppercase:true,default:''},
	dien_giai:{type:String,default:''},
	
	ma_bp:{type:String,default:'',uppercase:true},
	ma_phi:{type:String,default:'',uppercase:true},
	ma_hd:{type:String,default:'',uppercase:true},
	ma_dt:{type:String,default:'',uppercase:true},
	ma_nv:{type:String,default:'',uppercase:true},
	ma_sp:{type:String,default:'',uppercase:true},
	
	status:{type:String,required:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});

sokhoSchema.index({id_app:1,ma_dvcs:1,ngay_ct:1,ma_vt:1});
module.exports = mongoose.model('sokho',sokhoSchema);