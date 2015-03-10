var optionsSchema = new Schema({
	id_app:{type:String,required:true},
	id_func:{type:String,required:true},
	option:{},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
optionsSchema.index({id_app:1,id_func:1});
var model = mongoose.model("options",optionsSchema);
module.exports = model