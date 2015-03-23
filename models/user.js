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
var crypto   = require('crypto');
var userSchema = new Schema({
	local:{
		email		 : {type:String,lowercase:true},
		password	 : String,
		rspassword	 : String,
		name  		 : String,
		picture		 : String,
		address		 : String,
		phone		 : String,
		company		 : String,
		token        : String,
		active		 : {type:Boolean,default:false},
		key        	 : String
	},
	google           : {
        id           : String,
        token        : String,
        email        : {type:String,lowercase:true},
        name         : String,
		refreshToken : String,
		picture		 : String
    },
	facebook         : {
        id           : String,
        token        : String,
        email        : {type:String,lowercase:true},
        name         : String,
		refreshToken : String,
		picture		 : String
    },
	current_id_app:String,
	current_user:String,
	email        : {type:String,lowercase:true},
    name         : String,
	picture		 : String,
	token        : String,
	tokens       : [String],
	refreshToken : String,
	server		 : String,
	join_date	 :{type:Date,default:Date.now},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
userSchema.methods.generateHash = function(password) {
    return crypto.createHash('md5').update(password).digest('hex');
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	var c = crypto.createHash('md5').update(password).digest('hex');
    return (c==this.local.password);
};
userSchema.methods.validRspassword = function(password) {
	var c = crypto.createHash('md5').update(password).digest('hex');
    return (c==this.local.rspassword);
};

module.exports = mongoose.model("user",userSchema);