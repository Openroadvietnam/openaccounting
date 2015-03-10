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
var customerSchema = new Schema({
	id_app:{type:String,required:true},
	ma_kh:{type:String,uppercase:true,default:'',trim:true},
	ten_kh:{type:String,required:'ten_kh is required',trim:true},
	dia_chi:{type:String,default:''},
	dien_thoai:{type:String,default:''},
	fax:{type:String,default:''},
	email:{type:String,default:''},
	ma_so_thue:{type:String,default:''},
	loai_kh:{type:String,default:'',trim:true},
	nh_kh1:{type:String,default:'',trim:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
customerSchema.index({id_app:1,ma_kh:1,ten_kh:1});
var model = mongoose.model('customer',customerSchema);
model.referenceKeys ={
	ma_kh:[
		{model:"vsocai",key:'ma_kh',error:'Khách hàng {{VALUE}} đã phát sinh dữ liệu'},
		{model:"cdkh",key:'ma_kh',error:'Khách hàng {{VALUE}} đã phát sinh dữ liệu'}
	]
}
module.exports = model