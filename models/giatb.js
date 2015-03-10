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
var giatbSchema = new Schema({
	id_app:{type:String,required:true},
	nam:{type:Number,required:true,default:0},
	thang:{type:Number,required:true,default:0},
	ma_vt:{type:String,required:true,uppercase:true},
	ma_kho:{type:String,uppercase:true},
	ton_dau:{type:Number,default:0},
	du_dau:{type:Number,default:0},
	sl_nhap:{type:Number,default:0},
	tien_nhap:{type:Number,default:0},
	tong_sl:{type:Number,default:0},
	tong_tien:{type:Number,default:0},
	gia:{type:Number,default:0},
	
	status:{type:String,required:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});

giatbSchema.index({id_app:1,ma_dvcs:1,nam:1,thang:1,ma_vt:1,ma_kho:1});
module.exports = mongoose.model('giatb',giatbSchema);