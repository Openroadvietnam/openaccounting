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
var dmdvtSchema = new Schema({
	id_app:{type:String,required:true},
	ma_dvt:{type:String,required:true},
	ten_dvt:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmdvtSchema.index({id_app:1,ma_dvt:1,ten_dvt:1});
var model = mongoose.model("dmdvt",dmdvtSchema);
model.referenceKeys ={
	ma_dvt:[
		{model:"dmvt",key:'ma_dvt',error:'Đơn vị tính {{VALUE}} đã phát sinh dữ liệu'},
		{model:"sokho",key:'ma_dvt',error:'Đơn vị tính {{VALUE}} đã phát sinh dữ liệu'}
	]
}
module.exports = model