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
var User = require("./user");
var Colleague = require("./colleague");
var async = require("async");
var messageSchema = new Schema({
	email_sender:{type:String,required:true},
	email_receiver:{type:String,required:true},
	email_owner:{type:String,required:true},
	title:{type:String},
	content:{type:String},
	read:{type:Boolean,default:false},
	status:{type:Boolean,default:false},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
messageSchema.index({email_owner:1,email_sender:1,email_receiver:1});
var message =mongoose.model('message',messageSchema);
message.sendMessage = function(obj){
	Colleague.findOne({$or:[{email_owner:obj.email_sender},{email:obj.email_receiver}]},function(error,coll){
		if(error) return console.log(error);
		if(coll){
			coll.latest_message = obj.content;
			coll.latest_message_id = obj._id.toString();
			coll.latest_message_date = obj.date_created;
			coll.save(function(error){
				if(error) return console.log(error);
			});
		}
	});
	User.find({email:obj.email_receiver},{tokens:1},function(error,results){
		if(!error){
			if(results.length==1){
				if(results[0].tokens){
					async.each(results[0].tokens,function(token,callback){
						if(clientIO[token] && socketIO){
							//send content
							socketIO.to(clientIO[token]).emit("message",obj);
							console.log("sent messages to " + clientIO[token]);
						}else{
							callback();
						}
					},function(error){
						if(error){
							console.log("error send message:" + error);
						}
					});
				}
			}
		}else{
			console.log("error get user:" + error);
		}
	});
}
message.createMessage = function(email_sender,email_receiver,title,content,fn){
	var notifi = new message();
	notifi.email_owner = email_sender;
	notifi.email_sender = email_sender;
	notifi.email_receiver = email_receiver;
	
	notifi.title =title;
	notifi.content = content;
	notifi.user_created = email_sender;
	notifi.read = true;
	notifi.save(function(err){
		if(err){
			if(fn){
				fn(err);
			}
			return;
		}
		//
		alertMessage(email_sender);
		//
		var notifi_re = new message();
		notifi_re.email_owner = email_receiver;
		notifi_re.email_sender = email_sender;
		notifi_re.email_receiver = email_receiver;
		
		notifi_re.title =title;
		notifi_re.content = content;
		notifi_re.user_created = email_sender;
		
		notifi_re.save(function(err){
			if(err) {
				if(fn){
					fn(err);
				}
				return;
			}
			message.sendMessage(notifi_re);
			alertMessage(email_receiver);
			if(fn){
				fn(null,notifi,notifi_re);
			}
			
		});
	});
}
module.exports = message;