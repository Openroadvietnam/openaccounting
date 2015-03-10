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
var dmtanggiamtsSchema = new Schema({
	id_app:{type:String,required:true},
	kieu:{type:String,default:'1',required:true},
	ma_tang_giam_ts:{type:String,required:true,uppercase:true},
	ten_tang_giam_ts:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmtanggiamtsSchema.validate ={
	kieu:[function(id_app,value,callback){
		if(value=='1' || value=='2'){
			callback(true);
		}else{
			callback(false);
		}
	}
	,"Kiểu(kieu): 1- tăng, 2- giảm"]
}
dmtanggiamtsSchema.index({id_app:1,ma_tang_giam_ts:1,ten_tang_giam_ts:1});
module.exports = mongoose.model("dmtanggiamts",dmtanggiamtsSchema);