var dmcpmhSchema = new Schema({
	id_app:{type:String,required:true},
	ma_cp:{type:String,required:true},
	ten_cp:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmcpmhSchema.index({id_app:1,ma_cp:1,ten_cp:1});
module.exports = mongoose.model("dmcpmh",dmcpmhSchema);