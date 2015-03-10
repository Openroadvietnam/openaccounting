var tcSchema = new Schema({
	id_app:{type:String,required:true},
	ma_tc:{type:String,required:true},
	ten_tc:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
tcSchema.index({id_app:1,ma_tc:1,ten_tc:1});
module.exports = mongoose.model("tc",tcSchema);