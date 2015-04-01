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
var express = require("express");
var bodyParser = require('body-parser');
var passport = require("passport");
var phantom = require('phantom');
//database
global.mongoose = require("mongoose");
global.Schema = mongoose.Schema;
global.ctrlVouchers ={};
var configs = require("./configs");
global.port = process.env.PORT || 8000;
var connect = mongoose.connect(configs.database.url);
//app
var app = express();
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	return next();
});
app.use(function(req,res,next){
	if(req.originalUrl.indexOf('?_escaped_fragment_')>=0){
		var url = req.protocol + '://localhost:' + port + req.originalUrl;
		url = unescape(url.replace('?_escaped_fragment_=', '#!'));
		phantom.create(function (ph) {
			ph.createPage(function (page) {
				page.open(url, function (status) {
					page.evaluate(
						function (){
							return document.getElementsByTagName('html')[0].innerHTML;
						},
						function(result){
							res.send(result);
							ph.exit();
						}
					);
				});
			});
		},{
			dnodeOpts: {
				weak: false
			}
		}
					  );
	}else{
		next()
	}

});
app.use("/",express.static(__dirname + '/public/administrator'));
app.use("/sale",express.static(__dirname + '/public/sale'));
app.use("/templates",express.static(__dirname + '/templates'));
app.use("/admin-material",express.static(__dirname + '/public/administrator-material'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());

var server = require("http").Server(app);
//socket
var getNotifies = require("./libs/getNotifies");
var Message = require("./models/message");
global.socketIO = require("socket.io")(server);
global.clientIO = {};
socketIO.on("connection",function(socket){
	socket.on("login",function(msg){
		clientIO[msg.token] = socket.id;
		console.log("user " + msg.email + " login width token " + msg.token + ", socket_id: " + socket.id);
		//send invite notify
		getNotifies(msg.email,function(error,rs){
			if(!error){
				socketIO.to(socket.id).emit("notifies_count",rs.colls.length + rs.apps.length + rs.notifications.length);
				console.log("sent invite notify to " + clientIO[msg.token]);
			}else{
				console.log(error);
			}
		});
		//send messages notify
		Message.find({email_owner:msg.email,email_receiver:msg.email,read:false},{_id:1},function(error,messages){
			if(!error){
				socketIO.to(socket.id).emit("messages_count",messages.length);
				console.log("sent messages notify to " + clientIO[msg.token]);
			}else{
				console.log(error);
			}
		});
		//socketIO.to(socket.id).emit("login","you login width token " + msg.token);
	});
	socket.on("disconnect",function(){
		for(c in clientIO){
			if(clientIO[c]==socket.id){
				clientIO[c] = undefined;
				console.log( c + " disconnect");
			}
		}

	});
});
//alert notification
var User = require("./models/user");
var async = require("async");
global.alertNotification = function(email){
	User.find({email:email},{tokens:1},function(error,results){
		if(!error){
			if(results.length==1){
				if(results[0].tokens){
					async.each(results[0].tokens,function(token,callback){
						if(clientIO[token] && socketIO){
							getNotifies(email,function(error,notifies){
								if(!error){
									socketIO.to(clientIO[token]).emit("notifies_count",notifies.colls.length + notifies.apps.length+ notifies.notifications.length);
									console.log("sent invite notify to " + clientIO[token]);
								}else{
									console.log(error);
								}
								callback();
							});
						}else{
							callback();
						}
					},function(error){
					});
				}
			}
		}else{
			console.log(error);
		}
	});
}
global.alertMessage = function(email){
	User.find({email:email},{tokens:1},function(error,results){
		if(!error){
			if(results.length==1){
				if(results[0].tokens){
					async.each(results[0].tokens,function(token,callback){
						if(clientIO[token] && socketIO){
							Message.find({email_owner:email,email_receiver:email,read:false},{_id:1},function(error,messages){
								if(!error){
									socketIO.to(clientIO[token]).emit("messages_count",messages.length);
									console.log("sent messages notify to " + clientIO[token]);
								}else{
									console.log(error);
								}
								callback();
							});
						}else{
							callback();
						}
					},function(error){
					});
				}
			}
		}else{
			console.log(error);
		}
	});
}
//route
var route = require("./route");
route(app);
//start server
server.listen(port,function(){
	console.log("server start at " +port + " port");
});
/*	
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
	  // Fork workers.
	  for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	  }
	  cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	  });
} else {
	server.listen(port,function(){
		console.log("server start at " +port + " port");
	});
}
*/