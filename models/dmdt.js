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
var dmdtSchema = new Schema({
	id_app:{type:String,required:true},
	ma_dt:{type:String,required:true,uppercase:true},
	ten_dt:{type:String,required:true},
	tien_nt:{type:Number,default:0},
	tien:{type:Number,default:0},
	ma_nt:{type:String,default:'VND'},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmdtSchema.validate ={
	ma_nt:validator.existsNt
}
dmdtSchema.index({id_app:1,ma_dt:1,ten_dt:1});
var model = mongoose.model("dmdt",dmdtSchema);
model.referenceKeys ={
	ma_dt:[
		{model:"vsocai",key:'ma_dt',error:'Đối tượng {{VALUE}} đã phát sinh dữ liệu'}
	]
}

model.exists = [function(id_app,ma_dt,callback){
	if(!ma_dt || ma_dt.trim()==""){
		callback(true);
		return;
	}
	model.findOne({id_app:id_app,ma_dt:ma_dt},function(error,v){
		if(error || !v){
			return callback(false);
		}else{
			return callback(true);
		}
	});
},"Mã vụ việc ({PATH}) {VALUE} không tồn tại"];

module.exports = model