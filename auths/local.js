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
var App = require("../models/app");
var BasicStrategy = require('passport-http').BasicStrategy;
var underscore = require("underscore");
var crypto = require('crypto');
var validator = require('validator');
var email = require("../libs/email");
var loadTemplate = require("../libs/load-template");
module.exports = function(app,passport){
	function findByUsername(username, fn){
	  if( !username) return fn(null,null);
	  var username = username.toLowerCase();
	  User.findOne({email:username},function(error,result){
		if(error || !result) return fn(null,null);
		if(!result.local || !result.local.password){
			return fn(null,null);
		}
		return fn(null,result);
	  });
	}
	passport.use(new BasicStrategy(
	  function(username, password, done) {
		process.nextTick(function () {
		  findByUsername(username, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done("Email " + username + " chưa được đăng ký."); }
			if(user.local.rspassword){
				if (user.validRspassword(password)){
					user.local.password = user.local.rspassword;
					user.local.rspassword = undefined;
				}else{
					if (!user.validPassword(password)) { return done("Mật khẩu không chính xác."); }
				}
			}else{
				if (!user.validPassword(password)) { return done("Mật khẩu không chính xác."); }
			}
			var n = new Date();
			var accessToken =crypto.createHash('md5').update(user.local.password + user.email + n.toISOString()).digest('hex');
			user.local.token = accessToken;
			if(!user.tokens){
				user.tokens  = [];
			}
			if(!underscore.contains(user.tokens,accessToken)){
				user.tokens.push(accessToken);
			}
			user.picture = user.local.picture;
			user.name = user.local.name;	
			user.server = 'local';
			user.save(function(error){
				if(error) return done(error);
				return done(null, user);
			});
			
		  })
		});
	  }
	));

	app.get('/auth/local',
		passport.authenticate('basic', { session: false }),
		function(req, res){
			//log
			log.create({id_app:'LOGIN',id_func:'LOGIN',action:'LOCALLOGIN'},req.user.email,req.header('user-agent'),req)
			//
			var user = req.user;
			/*user.local = undefined;
			user.facebook = undefined;
			user.google = undefined;
			user.tokens = undefined;*/
			res.send(user.local.token);
		}
	);
	//sign up
	app.post("/signup",function(req,res,next){
		var body = req.body;
		if(body.json){
			body = JSON.parse(body.json)
		}
		if(!body) return res.send(411,"Không có nội dung");
		//
		if(!body.email){
			return res.send(400,"Lỗi: Email chưa nhập");
		}
		if(!validator.isEmail(body.email)){
			return res.send(400,"Lỗi: Email này không có giá trị");
		}
		body.email = body.email.toLowerCase();
		if(!body.name){
			return res.send(400,"Lỗi: Họ và tên chưa  nhập");
		}
		User.findOne({email:body.email},function(error,result){
			if(error) return res.send(400,error);
			
			if(result){ 
				if(result.local && result.local.email == body.email && result.local.password){
					return res.send(400,"Lỗi: Email " + body.email + " đã được đăng ký");
				}else{
					if(!result.local){
						result.local = {};
					}
				}
			}else{
				result = new User();
				result.email = body.email;
				result.local = {};
			}
			result.local.email = body.email;
			result.local.name = body.name;
			if(!body.picture){
				if(!result.local.picture){
					result.local.picture = '/images/avatar.jpg';
				}
			}else{
				result.local.picture = body.picture;
			}
			if(body.password && body.password.length>=6 && body.rePassword==body.password){
				var password = body.password
			}else{
				var password = crypto.createHash('md5').update(result.email + (new Date()).toISOString()).digest('hex');
			}
		
			result.local.password = result.generateHash(password);
			
			result.save(function(error){
				if(error) return next("Lỗi: Không thể đăng ký");
				//log
				log.create({id_app:'SIGNUP',id_func:'SIGNUP',action:'SIGNUP'},result.email,req.header('user-agent'),req)
				//
				//tu dong tao app
				if(body.cty_name){
					var app = new App();
					app.user_created = result.email;
					app.user_updated = result.email;
					app.name = body.cty_name;
					var d = new Date();
					app.ngay_dn = new Date(d.getFullYear(),0,1)
					app.ngay_ks = new Date(d.getFullYear()-1,12,0)
					app.nam_bd= d.getFullYear()
					app.ngay_ky1 = new Date(d.getFullYear(),0,1)
					
					app.save(function(error,obj){
						if(error) return console.log("Khong tao duoc new app: " + error);
						//khoi tao database ban dau
						var initDatabase = require("../libs/initDatabase");
						initDatabase.init(obj._id,function(error){
							if(error){
								console.log("Can't init database \n" + error);
							}
						});
						
					});
				}
				//send email thong bao
				loadTemplate("thong tin dang nhap.html",{email:result.email,password:password,receiver_name:body.name},function(error,html){
					if(error) return console.log(error);
					email.sendHtml({to:{name:result.name,address:result.email},subject:"Thông tin tài khoản",html:html},function(error,info){
						if(error) {
							console.error("Khong the gui email thon tin tai khoan cho nguoi dung\n" + error);
						}
					});
				})
				
				res.send("Tài khoản của bạn đã được tạo. Kiểm tra email để lấy thông tin đăng nhập");
				
			});
		});
	});
	app.get("/resetpassword",function(req,res,next){
		var address = req.query.email;
		if(!address) return res.send("Yêu cầu một email");
		address = address.toLowerCase();
		User.findOne({'local.email':address},function(error,result){
			if(error) return res.send(400,error);
			if(!result) return res.send(400,"Email này chưa được đăng ký");
			var newpassword = crypto.createHash('md5').update((new Date()).toISOString()).digest('hex');
			result.local.rspassword = result.generateHash(newpassword);
			result.save(function(error){
				if(error) return res.send(400,error);
				//log
				log.create({id_app:'RESETPASSWORD',id_func:'RESETPASSWORD',action:'RESETPASSWORD'},result.email,req.header('user-agent'),req)
				//
				loadTemplate("reset mat khau.html",{receiver_name:result.name,email:address,password:newpassword},function(error,html){
					if(error) return console.log(error);
					email.sendHtml({to:{name:result.name,address:result.email},subject:"Đổi mật khẩu",html:html},function(error,info){
						if(error) {
							console.error("Khong the gui thong tin tai khoan cho nguoi su dung\n" + error);
						}
					});
				});
				
				res.send("Mật khẩu của bạn đã được đổi thành công. Kiểm tra email để lấy mật khẩu mới, sau đó bạn nên đổi mật khẩu này");
			});
		});
	});
 }