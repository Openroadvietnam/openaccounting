var colleagueSchema = new Schema({
	email_owner:{type:String,required:true,lowercase:true},
	email:{type:String,required:true,lowercase:true},
	content:{type:String},
	active:{type:Boolean,default:false},
	cancel:{type:Boolean,default:false},
	status:{type:Boolean,default:false},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''},
	latest_message:{type:String,default:''},
	latest_message_id:{type:String},
	latest_message_date:{type:Date}
});
colleagueSchema.index({email_owner:1,email:1});
module.exports =mongoose.model('colleague',colleagueSchema);