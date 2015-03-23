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
	id_ts:{type:String},
	tk_no:{type:String,required:true,uppercase:true},
	tk_co:{type:String,required:true,uppercase:true},
	
	
	tien:{type:Number,default:0,required:true},
	tien_nt:{type:Number,default:0,required:true},
	
	ma_bp:{type:String,uppercase:true,default:''},
	ma_phi:{type:String,uppercase:true,default:''},
	ma_hd:{type:String,uppercase:true,default:''},
	ma_dt:{type:String,uppercase:true,default:''},
	ma_nv:{type:String,uppercase:true,default:''},
	line:{type:Number,default:0}
});
detailSchema.validate ={
	tk_no:validAccount.existsTk,
	tk_co:validAccount.existsTk
}
var pkhSchema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String,required:true},
	ma_ct:{type:String,default:'pkh',required:true,uppercase:true},
	ma_gd:{type:String,default:'0'},
	so_ct:{type:String,required:true,uppercase:true,trim:true},
	ngay_ct:{type:Date,default:Date.now,required:true},
	ma_nt:{type:String,required:'ma_nt is required',default:'VND',trim:true,uppercase:true},
	ty_gia:{type:Number,required:true,min:0,default:1},
	dien_giai:{type:String,default:''},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''},
	details:{type:[detailSchema]}
});
pkhSchema.validate ={
	ma_dvcs:validator.existsDvcs,
	ma_nt:validator.existsNt,
	ngay_ct:validator.unlockBook
}
pkhSchema.index({id_app:1,ma_dvcs:1,so_ct:1,ngay_ct:1});
module.exports = mongoose.model('pkh',pkhSchema);