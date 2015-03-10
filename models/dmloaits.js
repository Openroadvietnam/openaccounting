var dmloaitsSchema = new Schema({
	id_app:{type:String,required:true},
	ma_loai_ts:{type:String,required:true,uppercase:true},
	ten_loai_ts:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmloaitsSchema.index({id_app:1,ma_loai_ts:1,ten_loai_ts:1});
module.exports = mongoose.model("dmloaits",dmloaitsSchema);