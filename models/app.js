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
var participantScheam = new Schema({
	email:{type:String,required:true},
	admin:{type:Boolean,default:false},
	active:{type:Boolean,default:false},
	cancel:{type:Boolean,default:false},
	date_created:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	date_updated:{type:Date,default:Date.now},
	user_updated:{type:String,default:''}
});
var appScheam = new Schema({
	name:{type:String,required:true},
	address:{type:String,default:""},
	city:{type:String,default:""},
	province:{type:String,default:""},
	country:{type:String,default:""},
	phone:{type:String,default:""},
	fax:{type:String,default:""},
	email:{type:String,default:""},
	website:{type:String,default:""},
	sale_online:{type:Boolean,default:false},
	
	bao_hanh:{type:String},
	van_chuyen:{type:String},
	gioi_thieu:{type:String},
	nganh_nghe:{type:String},
	
	ngay_dn:{type:Date,required:true},//ngay bat dau su dung chuong trinh
	ngay_ks:{type:Date,required:true},
	nam_bd:{type:Number,required:true},
	ngay_ky1:{type:Date,required:true},//ngay bat dau nam tai chinh
	
	ma_so_thue:String,
	nguoi_nop_thue:String,
	giam_doc:String,
	ke_toan_truong:String,
	logo:String,
	
	participants:[participantScheam],
		
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
appScheam.index({name:1,province:1});
module.exports = mongoose.model("app",appScheam);