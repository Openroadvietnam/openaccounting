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
var vatSchema = new Schema({
	id_app:{type:String,required:true},
	ma_thue:{type:String,uppercase:true,required:true},
	ten_thue:{type:String,required:true},
	thue_suat:{type:Number,default:0,required:true},
	stt_in:{type:Number,default:0,required:true},
	
	tk_thue_no:{type:String,default:'',required:true},
	tk_thue_co:{type:String,default:'',required:true},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
vatSchema.validate = {
	tk_thue_co:validAccount.existsTk,
	tk_thue_no:validAccount.existsTk
}
vatSchema.index({id_app:1,ma_thue:1});
module.exports =mongoose.model('vat',vatSchema);