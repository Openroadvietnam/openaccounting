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
var validAccount = require("../libs/validator-account");
var qts = require("./qts");
var hspbtsScheam = new Schema({
	id_app:{type:String,required:true},
	nam:{type:Number,required:"Năm(nam) khấu hao không được trống"},
	thang:{type:Number,required:"Tháng(thang) khấu hao không được trống"},
	so_the_ts:{type:String,required:'Số thẻ tài sản không được trống',trim:true},
	
	tk_kh:{type:String,required:'Tài khoản khấu hao không được trống',trim:true},
	tk_cp:{type:String,required:'Tài khoản khấu hao không được trống',trim:true},
	
	ma_bp:{type:String,default:'',uppercase:true},
	ma_phi:{type:String,default:'',uppercase:true},
	ma_hd:{type:String,default:'',uppercase:true},
	ma_dt:{type:String,default:'',uppercase:true},
	ma_nv:{type:String,default:'',uppercase:true},
	ma_sp:{type:String,default:'',uppercase:true},
	
	he_so:{type:Number,default:0},
	

	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
hspbtsScheam.validate ={
	tk_cp: validAccount.existsTk,
	tk_kh: validAccount.existsTk,
	so_the_ts: qts.exists,
	ma_bp: validator.existsBp
};
hspbtsScheam.index({id_app:1,nam:1,so_the_ts:1,ma_bp:1});
module.exports = mongoose.model("hspbts",hspbtsScheam);