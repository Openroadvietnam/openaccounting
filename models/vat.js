var validAccount = require("../libs/validator-account");
var vatSchema = new Schema({
	id_app:{type:String,required:true},
	ma_thue:{type:String,uppercase:true,required:true},
	ten_thue:{type:String,required:true},
	thue_suat:{type:Number,default:0,required:true},
	stt_in:{type:Number,default:0,required:true},
	
	tk_thue_no:{type:String,default:'',required:true},
	tk_thue_co:{type:String,default:'',required:true},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
vatSchema.validate = {
	tk_thue_co:validAccount.existsTk,
	tk_thue_no:validAccount.existsTk
}
vatSchema.index({id_app:1,ma_thue:1});
module.exports =mongoose.model('vat',vatSchema);