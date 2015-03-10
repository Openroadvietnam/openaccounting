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
var notificationSchema = new Schema({
	email_sender:{type:String,required:true},
	email_receiver:{type:String,required:true},
	email_owner:{type:String,required:true},
	title:{type:String,required:true},
	content:{type:String},
	read:{type:Boolean,default:false},
	status:{type:Boolean,default:false},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
notificationSchema.index({email_owner:1,email_receiver:1,email_sender:1});
var Notification =mongoose.model('notification',notificationSchema);
Notification.createNotification = function(email_sender,email_receiver,title,content,fn){
	var notifi = new Notification();
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
		alertNotification(email_sender);
		//
		var notifi_re = new Notification();
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
			alertNotification(email_receiver);
			if(fn){
				fn(null,notifi,notifi_re);
			}
			
		});
	});
}
module.exports = Notification;