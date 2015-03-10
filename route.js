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
	
var fs = require("fs");
var appModel = require("./models/app");
var express = require("express");
var underscore = require("underscore");
var passport = require("passport");
var path = require("path")
var multer  = require('multer')
module.exports = function(app){
	//authentications
	var auth_google = require("./auths/google");
	auth_google(app,passport);
	var auth_facebook = require("./auths/facebook");
	auth_facebook(app,passport);
	var auth_local = require("./auths/local");
	auth_local(app,passport);
	
	var bearer = require("./auths/bearer");
	bearer(passport);
	//main router
	var router = express.Router();
	router.use(function(req,res,next){
		for(var key in req.query){
			if(req.query[key]=='true'){
				req.query[key] = true;
			}
			if(req.query[key]=='false'){
				req.query[key] = false;
			}
		}
		var access_token = req.query.access_token;
		if(!access_token){
			access_token= req.get("X-Access-Token");
		}
		if(access_token){
			req.query.access_token = access_token;
		}
		next();
	});
	router.use(passport.authenticate('bearer', { session: false }));
	router.param('id_app',
		function(req,res,next,id_app){
			var email = req.user.email;
			appModel.find({_id:id_app,$or:[{user_created:email},{participants:{$elemMatch:{email:email}}}]},function(error,results){
				if(error) return next(error);
				if(results.length==0){
					return res.status(400).send("Không có quyền");
				}else{
					req.user.current_id_app = id_app;
					req.query.id_app = id_app;
					next();

				}
			});
		}
	);
	router.use(multer({ dest: './uploads'}))
	
	app.use("/api",router);
	//vouchers
	fs.readdirSync("./modules/vouchers").forEach(function(file){
		if(file.substr(-3)==".js"){
			voucher = require("./modules/vouchers/" + file);
			ctrlVouchers[file.replace("vo-","").replace(".js","").toUpperCase()] = new voucher(router);
		}
	});
	//reports
	fs.readdirSync("./modules/reports").forEach(function(file){
		if(file.substr(-3)==".js"){
			report = require("./modules/reports/" + file);
			report(router);
		}
	});
	//lists
	fs.readdirSync("./modules/lists").forEach(function(file){
		if(file.substr(-3)==".js"){
			list = require("./modules/lists/" + file);
			list(router);
		}
	});
	//sys router 
	var sys_router = express.Router();
	sys_router.use(multer({ dest: './uploads'}))
	sys_router.use(passport.authenticate('bearer', { session: false }));
	app.use("/api",sys_router);
	//
	fs.readdirSync("./modules/systems").forEach(function(file){
		if(file.substr(-3)==".js"){
			sys = require("./modules/systems/" + file);
			sys(sys_router);
		}
	});
	//public
	var public_router = express.Router();
	public_router.use(function(req,res,next){
		for(var key in req.query){
			if(req.query[key]=='true'){
				req.query[key] = true;
			}
			if(req.query[key]=='false'){
				req.query[key] = false;
			}
			
			
		}
		if(req.query.id_app){
			var id_app = req.query.id_app;
			appModel.findOne({_id:id_app},function(error,app){
				if(error) return next(error);
				if(!app){
					return res.status(400).send("Không tồn tại công ty này");
				}else{
					var user ={current_id_app:id_app,email:'public'}
					req.user = user;
					req.query.id_app = id_app;
					next();
				}
			});
		}else{
			next();
		}
		
	});
	public_router.use(multer({ dest: './uploads'}))
	app.use("/public",public_router);
	fs.readdirSync("./modules/public").forEach(function(file){
		if(file.substr(-3)==".js"){
			p = require("./modules/public/" + file);
			p(public_router);
		}
	});
	//view image
	app.get("/getfile/:folder/:filename",function(req,res,next){
		var imgPath = path.join( __dirname,"images",req.params.folder,req.params.filename);
		if(fs.existsSync(imgPath)){
			res.sendFile(imgPath);
		}else{
			res.sendFile(path.join(__dirname,"images","others","noimage.png"))
		}
	});
}