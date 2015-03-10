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
var validator = require("../libs/validator");
var validVt = require("../libs/validator-vt");
var cdvtScheam = new Schema({
	id_app:{type:String,required:true},
	nam:{type:Number,required:true},
	ma_dvcs:{type:String,required:true},
	ma_vt:{type:String,required:'Lỗi: Mã vật tư không được trống',uppercase:true},
	ma_kho:{type:String,required:'Lỗi: Mã kho không được trống',uppercase:true},
	
	ton00:{type:Number,default:0},
	du00:{type:Number,default:0},
	du_nt00:{type:Number,default:0},
	
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
cdvtScheam.validate = {
	ma_dvcs:validator.existsDvcs,
	ma_vt: validVt.existsVt,
	ma_kho: validVt.existsKho,
};
cdvtScheam.index({id_app:1,nam:1,ma_dvcs:1,ma_vt:1,ma_kho:1});
module.exports = mongoose.model("cdvt",cdvtScheam);