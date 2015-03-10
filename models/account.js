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
var dmnt = require("./currency");
var accountSchema = new Schema({
	id_app:{type:String,required:true},
	tk:{type:String,required:'tk is required',uppercase:true,trim:true},
	ten_tk:{type:String,required:'ten_tk is required',trim:true},
	tk_me:{type:String,default:'',trim:true,uppercase:true},
	loai_tk:{type:Number,min:0,max:1,default:1},//0:tk me,1:tai khoan chi tiet
	tk_cn:{type:Boolean,default:false,required:true},
	ma_nt:{type:String,uppercase:true,required:'ma_nt is required',default:'VND',trim:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
accountSchema.index({id_app:1,tk:1});
accountSchema.validate ={
	ma_nt:[
		function(id_app,value,callback){
			if(!value){
				return callback(true);
			}
			dmnt.findOne({id_app:id_app,ma_nt:value},function(error,nt){
				if(error) return callback(false);
				if(nt) callback(true);
			});
		}
		,'Mã ngoại tệ không tồn tại'
	]
};
var model = mongoose.model("account",accountSchema);
model.referenceKeys ={
	tk:[
		{model:"vsocai",key:'tk',error:'Tài khoản {{VALUE}} đã phát sinh dữ liệu'},
		{model:"cdtk",key:'tk',error:'Tài khoản {{VALUE}} đã phát sinh dữ liệu'},
		{model:"cdkh",key:'tk',error:'Tài khoản {{VALUE}} đã phát sinh dữ liệu'},
		{model:"dmvt",key:'tk_vt',error:'Tài khoản {{VALUE}} đã phát sinh dữ liệu'}
	]
}
module.exports = model;