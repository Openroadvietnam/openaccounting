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
var model = require("../../models/app");
var User = require("../../models/user");
var log = require("../../models/log");
var getNotifies = require("../../libs/getNotifies");
var underscore = require("underscore");
var async = require("async");
var controller = require("../../controllers/controller");
var fs = require('fs')
var gm = require('gm').subClass({ imageMagick: true });
var usersAdmin = require("../../configs").admins;
module.exports = function(router){
	router.route("/user").get(function(req,res,next){
		var access_token = req.query.access_token;
		User.findOne({tokens:access_token}).lean().exec(function(error,user){
			if(error) return res.status(400).send(error);
			if(user){
				user.local.password = undefined;
				user.local.rspassword = undefined;
				user.token = access_token;
				user.admin = underscore.contains(usersAdmin,user.email);
				res.send(user);
			}else{
				res.status(404).send("Không tìm thấy thông tin của tài khoản này");
			}
		});
	});
	router.route("/profile").get(function(req,res,next){
		var email = req.query.email;
		var query ={};
		if(email){
			query.email = email;
		}else{
			query.tokens = req.query.access_token;
		}
		User.findOne(query).lean().exec(function(error,user){
			if(error) return res.status(400).send(error);
			if(user){
				delete user.local.password;
				delete user.local.rspassword;
				res.send(user.local);
				
			}else{
				res.status(404).send("Không tìm thấy thông tin của tài khoản này");
			}
		});
	});
	router.route("/uploadfile").post(function(req,res,next){
		var access_token = req.query.access_token;
		var folder = req.query.folder;
		var id_app = req.query.id_app;
		//
		if(!req.files.fileupload){
			res.status(400).send("File không tồn tại");
			return;
		}
		//
		var path = require('path');
		var ext = path.extname(req.files.fileupload.path);
		if(ext){
			ext = ext.toLowerCase();
			if(ext!='.png' && ext!='.jpg' && ext!='.jpeg'){
				res.status(400).send("Chỉ chấp nhận các định dạng file: PNG,JPG,JPEG");
				return;
			}
		}else{
			res.status(400).send("Chỉ chấp nhận các định dạng file: PNG,JPG,JPEG");
			return;
		}

		User.findOne({tokens:access_token},function(error,user){
			if(error) return res.status(400).send(error);
			if(user){
				fs.readFile(req.files.fileupload.path, function (err, data) {
					if(err) return res(err);
					if(!fs.existsSync("./images/" + folder)){
						fs.mkdirSync("./images/" + folder);
					}
					if(id_app && folder!='avatar'){
						folder = folder + "/" + id_app;
						if(!fs.existsSync("./images/" + folder)){
							fs.mkdirSync("./images/" + folder);
						}
					}
					var newPath = folder + "/" + user._id.toString() + "_" + req.files.fileupload.originalname;
					var path_image = "./images/" + newPath;
					var p = req.files.fileupload.originalname.split(".");
					var path_image_thumb = "./images/" + newPath + ".thumb." + p[p.length-1];
					gm(req.files.fileupload.path).size(function(error,value){
							if(error) return res.status(400).send(error);
							async.parallel([
								function(callback){
									if(value.width>1024){
										gm(req.files.fileupload.path).resize(1024).write(path_image,function(error){
											callback(error);
										});
									}else{
										fs.writeFile(path_image, data, function (err) {
											callback(err);
										});
									}
								}
							],function(err,result){
								if(err) return res.status(400).send(err);
								gm(path_image).resize(350).write(path_image_thumb,function(error){
									if(error) {
										console.log("Không thể tạo thumbnail cho hình ảnh này. Kiem tra cai dat imageMagick\n" +error)
										res.status(400).send(error);
										return;
									};
									//
									fs.unlink(req.files.fileupload.path);
									var path_avatar = "/getfile/" + newPath;
									if(req.query.json){
										return res.send({fileUrl:path_avatar});
									}
									if(folder=="avatar"){
										user.local.picture = path_avatar;
										user.picture = user.local.picture;
										user.save(function(error){
											if(error) return res.status(400).send(error);
											res.writeHead(200, {'Content-Type': 'text/html'});
											res.end("<html><head><title>" + path_avatar + "</title></head><body>success</body></html>");
										});
									}else{
										res.writeHead(200, {'Content-Type': 'text/html'});
										res.end("<html><head><title>" + path_avatar + "</title></head><body>success</body></html>");
									}
								});
							});
					});
				});
			}else{
				res.status(404).send("Not found");
			}
		});
	});
	router.route("/uploadexcel").post(function(req,res,next){
		var access_token = req.query.access_token;
		var folder = "excels";
		var id_app = req.query.id_app;
		//
		if(!req.files.fileupload){
			res.status(400).send("File không tồn tại");
			return;
		}
		//
		var path = require('path');
		var ext = path.extname(req.files.fileupload.path);
		if(ext){
			ext = ext.toLowerCase();
			if(ext!='.xlsx'){
				res.status(400).send("Chỉ chấp nhận các định dạng file: xlsx");
				return;
			}
		}else{
			res.status(400).send("Chỉ chấp nhận các định dạng file: xlsx");
			return;
		}

		User.findOne({tokens:access_token},function(error,user){
			if(error) return res.status(400).send(error);
			if(user){
				fs.readFile(req.files.fileupload.path, function (err, data) {
					if(err) return res(err);
					if(!fs.existsSync("./templates/" + folder)){
						fs.mkdirSync("./templates/" + folder);
					}
					//
					var newPath = "./templates/" +  folder + "/" + user._id.toString() + "_" + path.basename(req.files.fileupload.path);
					fs.unlink(req.files.fileupload.path);
					fs.writeFile(newPath,data,function(error){
						if(error){
							return res.status(404).send(error);
						}
						//
						var url_file = newPath;
						if(req.query.json){
							return res.send({fileUrl:url_file});
						}
						res.writeHead(200, {'Content-Type': 'text/html'});
						res.end("<html><head><title>" + url_file + "</title></head><body>success</body></html>");
					});
				});
			}else{
				res.status(404).send("Not found");
			}
		});
	});
	router.route("/updateprofile").post(function(req,res,next){
		var access_token = req.query.access_token;
		User.findOne({tokens:access_token},function(error,user){
			if(error) return res.status(400).send(error);
			if(user){
				var profile = req.body;
				if(profile.name) user.local.name = profile.name;
				if(profile.address) user.local.address = profile.address;
				if(profile.phone) user.local.phone = profile.phone;
				if(profile.picture) user.local.picture = profile.picture;
				if(profile.company) user.local.company = profile.company;
				user.save(function(error){
					if(error) return res.status(400).send(error);
					//log
					log.create({id_app:'CHANGEPROFILE',id_func:'CHANGEPROFILE',action:'CHANGEPROFILE'},user.email,req.header('user-agent'),req)
					//
					res.send("Đã cập nhật thành công");
				});
			}else{
				res.status(404).send("Not found");
			}
		});
	});
	router.route("/changepassword").post(function(req,res,next){
		var access_token = req.query.access_token;
		User.findOne({tokens:access_token},function(error,user){
			if(error) return res.status(400).send(error);
			
			if(user){
				var passwords = req.body;
				if(user.local.password){
					if(!passwords.oldPassword || !user.validPassword(passwords.oldPassword)){
						return res.status(400).send("Mật khẩu hiện tại không chính xác");
					}
				}
				if(passwords.newPassword!=passwords.reNewPassword){
					return res.status(400).send("Hai mật khẩu mới phải giống nhau");
				}
				if(!passwords.newPassword){
					return res.status(400).send("Bạn chưa nhập mật khẩu mới");
				}
				user.local.password = user.generateHash(passwords.newPassword);
				user.save(function(error){
					if(error) return next(error);
					//log
					log.create({id_app:'CHANGEPASSWORD',id_func:'CHANGEPASSWORD',action:'CHANGEPASSWORD'},user.email,req.header('user-agent'),req)
					//
					res.send("Đã cập nhật thành công");
				});
			}else{
				res.status(404).send("Not found");
			}
		});
	});
	
	router.route("/user/logout").get(function(req,res,next){
		var access_token = req.query.access_token;
		User.findOne({tokens:access_token},{tokens:1,email:1},function(error,user){
			if(error) {
				
				return res.status(400).send(error);
			}
			var tokens = user.tokens;
			if(tokens){
				tokens = underscore.reject(tokens,function(t){
					return t==access_token;
				});
			}
			User.update({tokens:access_token},{token:null,tokens:tokens},function(error,result){
				if(error) {
					
					return res.status(400).send(error);
				}
				var socketID = clientIO[access_token];
				if(socketID && socketIO.sockets.connected[socketID]){
					socketIO.sockets.connected[socketID].disconnect();
				}
				//log
				log.create({id_app:'LOGOUT',id_func:'LOGOUT',action:'LOGOUT'},user.email,req.header('user-agent'),req)
				//
				console.log(user.email + " logged out");
				res.send(user.email + " logged out");
			});
		});
		
	});
	//
	router.route("/notifies").get(function(req,res,next){
		getNotifies(req.user.email,function(error,notifies){
			if(error) return res.status(400).send(error);
			res.send(notifies);
			
		});
	});
}