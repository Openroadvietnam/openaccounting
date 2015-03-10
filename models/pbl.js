var validAccount = require("../libs/validator-account");
var validVt = require("../libs/validator-vt");
var validator = require("../libs/validator");
var detailSchema = new Schema({
	ma_vt:{type:String,required:true,uppercase:true},
	ma_dvt:{type:String,required:true},
	ma_kho:{type:String,required:true,uppercase:true},
	
	px_gia_dd:{type:Boolean,default:false},
	sl_xuat:{type:Number,default:0,required:true},
	gia_von:{type:Number,default:0,required:true},
	gia_von_nt:{type:Number,default:0,required:true},
	tien_xuat:{type:Number,default:0,required:true},
	tien_xuat_nt:{type:Number,default:0,required:true},
	
	gia_ban:{type:Number,default:0,required:true},
	gia_ban_nt:{type:Number,default:0,required:true},
	
	tien_hang:{type:Number,default:0,required:true},
	tien_hang_nt:{type:Number,default:0,required:true},
	
	ty_le_ck:{type:Number,default:0,required:true},
	tien_ck:{type:Number,default:0,required:true},
	tien_ck_nt:{type:Number,default:0,required:true},
	
	tien:{type:Number,default:0,required:true},
	tien_nt:{type:Number,default:0,required:true},
	
	ma_bp:{type:String,uppercase:true,default:''},
	ma_phi:{type:String,uppercase:true,default:''},
	ma_hd:{type:String,uppercase:true,default:''},
	ma_dt:{type:String,uppercase:true,default:''},
	ma_nv:{type:String,uppercase:true,default:''},
	ma_lo:{type:String,uppercase:true,default:''},
	line:{type:Number,default:0}
});
detailSchema.validate ={
	ma_vt:validVt.existsVt,
	ma_kho:validVt.existsKho,
	ma_dvt:validator.existsDvt
}

var pblSchema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String,required:true},
	ma_ct:{type:String,default:'PBL',required:true,uppercase:true},
	ma_gd:{type:String,default:'0'},
	so_ct:{type:String,uppercase:true,trim:true},
	ngay_ct:{type:Date,default:Date.now,required:true},
	ma_nt:{type:String,required:'ma_nt is required',default:'VND',trim:true,uppercase:true},
	ty_gia:{type:Number,required:true,min:0,default:1},
	ma_kh:{type:String,uppercase:true,default:''},
	ma_kho:{type:String,uppercase:true,default:''},
	
	ty_le_ck_hd:{type:Number,default:0},
	tien_ck_hd:{type:Number,default:0},

	tien_thu:{type:Number,default:0},
	con_no:{type:Number,default:0},
	
	dien_giai:{type:String,default:''},
	
	nguoi_giao_dich:{type:String},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''},
	status: {type:String,default:'5'},
	details:{type:[detailSchema]}
});
pblSchema.validate ={
	ma_dvcs:validator.existsDvcs,
	ma_nt:validator.existsNt,
	ngay_ct:validator.unlockBook,
	ma_kh:validator.existsKh,
	ma_kho:validVt.existsKho
}
pblSchema.index({id_app:1,ma_dvcs:1,so_ct:1,ngay_ct:1});
module.exports = mongoose.model('pbl',pblSchema);