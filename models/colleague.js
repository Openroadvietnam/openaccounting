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
var colleagueSchema = new Schema({
	email_owner:{type:String,required:true,lowercase:true},
	email:{type:String,required:true,lowercase:true},
	content:{type:String},
	active:{type:Boolean,default:false},
	cancel:{type:Boolean,default:false},
	status:{type:Boolean,default:false},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''},
	latest_message:{type:String,default:''},
	latest_message_id:{type:String},
	latest_message_date:{type:Date}
});
colleagueSchema.index({email_owner:1,email:1});
module.exports =mongoose.model('colleague',colleagueSchema);