var dmdvtSchema = new Schema({
	id_app:{type:String,required:true},
	ma_dvt:{type:String,required:true},
	ten_dvt:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmdvtSchema.index({id_app:1,ma_dvt:1,ten_dvt:1});
var model = mongoose.model("dmdvt",dmdvtSchema);
model.referenceKeys ={
	ma_dvt:[
		{model:"dmvt",key:'ma_dvt',error:'Đơn vị tính {{VALUE}} đã phát sinh dữ liệu'},
		{model:"sokho",key:'ma_dvt',error:'Đơn vị tính {{VALUE}} đã phát sinh dữ liệu'}
	]
}
module.exports = model