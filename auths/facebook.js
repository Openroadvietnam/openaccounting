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
var facebookconfig = require("../configs").facebook;
var facebookStrategy = require('passport-facebook').Strategy;
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
	passport.use(new facebookStrategy({
		clientID: facebookconfig.clientID,
		clientSecret: facebookconfig.clientSecret,
		callbackURL: facebookconfig.callbackURL,
		enableProof: false
	  },
	  function(accessToken, refreshToken, profile, done) {
		 //console.log(profile);
		  process.nextTick(function() {
				User.findOne({email: profile.emails[0].value },function(error,user){
				if(error) return done(error);
				if(!user){
					user = new User();
					user.current_user = profile.emails[0].value;
					user.facebook.id = profile.id;
					user.facebook.token = accessToken;
					user.facebook.email = profile.emails[0].value;
					user.facebook.name = profile.displayName;
					user.facebook.refreshToken = refreshToken;
					user.facebook.picture = "https://graph.facebook.com/" + profile.id + "/picture?type=large";
					
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
					user.picture = "https://graph.facebook.com/" + profile.id + "/picture?type=large";
					user.server ='facebook';
					
					user.local={email:user.email,name:user.name,picture:user.picture};
					
					if(!user.join_date){
						user.join_date = new Date();
					}
					user.save(function(err,user){
						if(err) return done(err);
						console.log("create new user");
						return done(null, user);
					});
				}else{
					user.facebook.token = accessToken;
					user.facebook.refreshToken = refreshToken;
					user.facebook.name = profile.displayName;
					user.facebook.picture = "https://graph.facebook.com/" + profile.id + "/picture?type=large";
					
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
					user.server ='facebook';
					if(!user.local){
						user.picture = "https://graph.facebook.com/" + profile.id + "/picture?type=large";
						user.local={email:user.email,name:user.name,picture:user.picture};
					}
					user.save(function(err,user){
						if(err) return done(err);
						console.log("update user information");
						return done(null,user);
					});
					
				}
			});
		  }
		  );

	  })
	);

	app.get('/auth/facebook',
	  passport.authenticate('facebook', {scope:facebookconfig.scope}));

	app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', {failureRedirect: '/auth/facebook' }),
	  function(req, res) {
		//log
		log.create({id_app:'LOGIN',id_func:'LOGIN',action:'FACBOOKLOGIN'},req.user.email,req.header('user-agent'),req)
		//
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end("<html><head><title>" + req.user.facebook.token + "</title></head><body>access_token = " + req.user.facebook.token + "</body></html>");
	  });
 }