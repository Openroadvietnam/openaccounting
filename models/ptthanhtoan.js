var ptthanhtoanSchema = new Schema({
	id_app:{type:String,required:true},
	ten:{type:String,required:true},
	
	ngan_hang:String,
	tai_khoan_nh:String,
	chu_tai_khoan:String,
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
ptthanhtoanSchema.index({id_app:1});
module.exports = mongoose.model("ptthanhtoan",ptthanhtoanSchema);