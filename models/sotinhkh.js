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
var sotinhkhScheam = new Schema({
	id_app:{type:String,required:true},
	nam:{type:Number,required:true},
	thang:{type:Number,required:true},
	so_the_ts:{type:String,required:true},
	id_ts:String,
	nguyen_gia:{type:Number,default:0},
	gia_tri_da_kh:{type:Number,default:0},
	gia_tri_con_lai:{type:Number,default:0},
	gia_tri_kh_ky:{type:Number,default:0},
	
	ngay_dau_thang:Date,
	ngay_cuoi_thang:Date,
	so_ngay_kh:Number,
	
	sua_kh:{type:Boolean,default:false},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
module.exports = mongoose.model("sotinhkh",sotinhkhScheam);