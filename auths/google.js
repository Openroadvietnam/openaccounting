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
var log = require("../models/log");
var googleconfig = require("../configs").google;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var underscore = require("underscore");
module.exports = function(app,passport){
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	passport.use(new GoogleStrategy({
		clientID: googleconfig.clientID,
		clientSecret: googleconfig.clientSecret,
		callbackURL: googleconfig.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
		  process.nextTick(function() {
				User.findOne({email: profile.emails[0].value},function(error,user){
				if(error) return done(error);
				if(!user){
					user = new User();
					user.current_user = profile.emails[0].value;
					user.google.id = profile.id;
					user.google.token = accessToken;
					user.google.email = profile.emails[0].value;
					user.google.name = profile.displayName;
					user.google.refreshToken = refreshToken;
					user.google.picture = profile._json.picture;
					user.token = accessToken;
					if(!user.tokens){
						user.tokens  = [];
					}
					if(!underscore.contains(user.tokens,accessToken)){
						user.tokens.push(accessToken);
					}
					user.email = profile.emails[0].value;
					user.name = profile.displayName;
					user.refreshToken = refreshToken;
					user.picture = profile._json.picture;
					user.join_date = new Date();
					user.server = 'google';
					user.local={email:user.email,name:user.name,picture:user.picture};
					user.save(function(err,user){
						if(err) return done(err);
						console.log("create new user");
						return done(null, user);
					});
					
				}else{
					user.google.token = accessToken;
					user.google.refreshToken = refreshToken;
					user.google.name = profile.displayName;
					user.google.picture = profile._json.picture;
					
					user.token = accessToken;
					if(!user.tokens){
						user.tokens  = [];
					}
					if(!underscore.contains(user.tokens,accessToken)){
						user.tokens.push(accessToken);
					}
					user.name = profile.displayName;
					user.refreshToken = refreshToken;
					if(!user.join_date){
						user.join_date = new Date();
					}
					user.server = 'google'
					if(!user.local){
						user.picture = profile._json.picture;
						user.local={email:user.email,name:user.name,picture:user.picture};
					}
					user.save(function(err,user){
						if(err) return done(err);
						console.log("update google user information");
						return done(null,user);
					});
					
					
				}
			});
		  }
		  );

	  })
	);

	app.get('/auth/google',
	  passport.authenticate('google', {scope:googleconfig.scope}));

	app.get('/auth/google/callback', 
	  passport.authenticate('google', {failureRedirect: '/auth/google' }),
	  function(req, res) {
		//log
		log.create({id_app:'LOGIN',id_func:'LOGIN',action:'GOOGLELOGIN'},req.user.email,req.header('user-agent'),req)
		//
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end("<html><head><title>" + req.user.google.token + "</title></head><body>access_token = " + req.user.google.token + "</body></html>");
	  });
 }