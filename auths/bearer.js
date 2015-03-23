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
var User = require("../models/user");
var underscore = require("underscore");
var BearerStrategy = require('passport-http-bearer').Strategy;
module.exports = function(passport){
	function findByToken(token, fn) {
	  User.findOne({tokens:token},function(error,user){
		if(error) return fn(error);
		if(user) {
			user.current_user = user.email;
			user.token = token;
			if(user.status==false){
				return fn("Người sử dụng này đã bị khóa.")
			}
			return fn(null,user);
		}
		return fn(null, null);
	  });
	  
	}
	passport.use(new BearerStrategy({},
	  function(token, done) {
		process.nextTick(function () {
		  findByToken(token, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				console.log("Not found token " + token);
				return done(null, false); 
			}
			/*user.local = undefined;
			user.facebook = undefined;
			user.google = undefined;
			user.tokens = undefined;
			*/
			return done(null, user);
		  })
		});
	  }
	));
}