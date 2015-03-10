var validator = require("../libs/validator");
var validVt = require("../libs/validator-vt");
var cdvtScheam = new Schema({
	id_app:{type:String,required:true},
	nam:{type:Number,required:true},
	ma_dvcs:{type:String,required:true},
	ma_vt:{type:String,required:'Lỗi: Mã vật tư không được trống',uppercase:true},
	ma_kho:{type:String,required:'Lỗi: Mã kho không được trống',uppercase:true},
	
	ton00:{type:Number,default:0},
	du00:{type:Number,default:0},
	du_nt00:{type:Number,default:0},
	
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
cdvtScheam.validate = {
	ma_dvcs:validator.existsDvcs,
	ma_vt: validVt.existsVt,
	ma_kho: validVt.existsKho,
};
cdvtScheam.index({id_app:1,nam:1,ma_dvcs:1,ma_vt:1,ma_kho:1});
module.exports = mongoose.model("cdvt",cdvtScheam);