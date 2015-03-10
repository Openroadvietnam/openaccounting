var validator = require("../libs/validator");
var validAccount = require("../libs/validator-account");
var qts = require("./qts");
var hspbtsScheam = new Schema({
	id_app:{type:String,required:true},
	nam:{type:Number,required:"Năm(nam) khấu hao không được trống"},
	thang:{type:Number,required:"Tháng(thang) khấu hao không được trống"},
	so_the_ts:{type:String,required:'Số thẻ tài sản không được trống',trim:true},
	
	tk_kh:{type:String,required:'Tài khoản khấu hao không được trống',trim:true},
	tk_cp:{type:String,required:'Tài khoản khấu hao không được trống',trim:true},
	
	ma_bp:{type:String,default:'',uppercase:true},
	ma_phi:{type:String,default:'',uppercase:true},
	ma_hd:{type:String,default:'',uppercase:true},
	ma_dt:{type:String,default:'',uppercase:true},
	ma_nv:{type:String,default:'',uppercase:true},
	ma_sp:{type:String,default:'',uppercase:true},
	
	he_so:{type:Number,default:0},
	

	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
hspbtsScheam.validate ={
	tk_cp: validAccount.existsTk,
	tk_kh: validAccount.existsTk,
	so_the_ts: qts.exists,
	ma_bp: validator.existsBp
};
hspbtsScheam.index({id_app:1,nam:1,so_the_ts:1,ma_bp:1});
module.exports = mongoose.model("hspbts",hspbtsScheam);