var dmkhoSchema = new Schema({
	id_app:{type:String,required:true},
	ma_kho:{type:String,required:true,uppercase:true},
	ten_kho:{type:String,required:true},
	kho_dl:{type:Boolean,default:false},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmkhoSchema.index({id_app:1,ma_kho:1,ten_kho:1});
var model = mongoose.model("dmkho",dmkhoSchema);
model.referenceKeys ={
	ma_kho:[
		{model:"sokho",key:'ma_kho',error:'Mã kho {{VALUE}} đã phát sinh dữ liệu'}
	]
}
module.exports = model