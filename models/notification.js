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