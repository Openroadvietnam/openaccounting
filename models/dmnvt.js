var dmnvtSchema = new Schema({
	id_app:{type:String,required:true},
	ten_nvt:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmnvtSchema.index({id_app:1,ten_nvt:1});
module.exports = mongoose.model("dmnvt",dmnvtSchema);