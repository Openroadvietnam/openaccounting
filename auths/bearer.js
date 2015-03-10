var User = require("../models/user");
var BearerStrategy = require('passport-http-bearer').Strategy;
module.exports = function(passport){
	function findByToken(token, fn) {
	  User.findOne({tokens:token},function(error,user){
		if(error) return fn(error);
		if(user) {
			user.current_user = user.email;
			user.token = token;
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