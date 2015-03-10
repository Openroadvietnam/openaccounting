var dmbpSchema = new Schema({
	id_app:{type:String,required:true},
	ma_bp:{type:String,required:true,uppercase:true},
	ten_bp:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmbpSchema.index({id_app:1,ma_bp:1,ten_bp:1});
var model = mongoose.model("dmbp",dmbpSchema);
model.referenceKeys ={
	ma_bp:[
		{model:"vsocai",key:'ma_bp',error:'Bộ phận {{VALUE}} đã phát sinh dữ liệu'},
		{model:"qts",key:'ma_bp',error:'Bộ phận {{VALUE}} đã phát sinh dữ liệu'}
	]
}
module.exports = model