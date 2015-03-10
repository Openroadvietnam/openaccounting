var logSchema = new Schema({
	id_app:{type:String},
	id_func:{type:String},
	action:{type:String},
	description:{type:String},
	data:{},
	ip:{type:String},
	user_agent:{type:String},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
logSchema.index({id_app:1,id_func:1,action:1});
var Log = mongoose.model("log",logSchema);
Log.create = function(log,user_created,user_agent,req){
	var l = new Log();
	l.id_app = log.id_app;
	l.id_func = log.id_func;
	l.action = log.action;
	l.description = log.description;
	l.data = log.data;
	l.user_agent = user_agent
	l.user_created = user_created;
	if(req){
		l.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	}
	l.save(function(error){
		if(error) console.log("Can't create log\n" + error)
	})	
}
module.exports = Log