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
var replySchema = new Schema({
	id_comment:{type:String,required:true},
	email:{type:String,required:true},
	name:{type:String,required:true},
	comment:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now}
});
var commentSchema = new Schema({
	id_product:{type:String,required:true},
	email:{type:String,required:"Vui lòng nhập email"},
	name:{type:String,required:"Vui lòng nhập tên"},
	comment:{type:String,required:"Vui lòng nhập nội dung"},
	reply:[replySchema],
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
commentSchema.index({id_product:1});
var model = mongoose.model("comment",commentSchema);
module.exports = model