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
var dmbpSchema = new Schema({
	id_app:{type:String,required:true},
	ma_bp:{type:String,required:true,uppercase:true},
	ten_bp:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmbpSchema.index({id_app:1,ma_bp:1,ten_bp:1});
var model = mongoose.model("dmbp",dmbpSchema);
model.referenceKeys ={
	ma_bp:[
		{model:"vsocai",key:'ma_bp',error:'Bộ phận {{VALUE}} đã phát sinh dữ liệu'},
		{model:"qts",key:'ma_bp',error:'Bộ phận {{VALUE}} đã phát sinh dữ liệu'}
	]
}
module.exports = model