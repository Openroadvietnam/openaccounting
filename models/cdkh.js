var validator = require("../libs/validator");
var validAccount = require("../libs/validator-account");
var cdkhScheam = new Schema({
	id_app:{type:String,required:true},
	nam:{type:Number,required:true},
	ma_dvcs:{type:String,required:true},
	tk:{type:String,required:'tk is required',trim:true},
	ma_kh:{type:String,required:'ma_kh is required',uppercase:true,trim:true},
	du_no00:{type:Number,default:0},
	du_co00:{type:Number,default:0},
	du_no_nt00:{type:Number,default:0},
	du_co_nt00:{type:Number,default:0},
	
	du_no1:{type:Number,default:0},
	du_co1:{type:Number,default:0},
	du_no_nt1:{type:Number,default:0},
	du_co_nt1:{type:Number,default:0},

	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
cdkhScheam.validate ={
	ma_dvcs:validator.existsDvcs,
	tk: validAccount.isTkcn,
	ma_kh:validator.existsKh
};
cdkhScheam.index({id_app:1,nam:1,ma_dvcs:1,tk:1,ma_kh:1});
module.exports = mongoose.model("cdkh",cdkhScheam);