var validAccount = require("../libs/validator-account");
var validator = require("../libs/validator");
var detailSchema = new Schema({
	tk_co:{type:String,required:true,uppercase:true},
	ma_kh:{type:String,uppercase:true,default:''},

	tien:{type:Number,default:0,required:true},
	tien_nt:{type:Number,default:0,required:true},
	
	ma_bp:{type:String,uppercase:true,default:''},
	ma_phi:{type:String,uppercase:true,default:''},
	ma_hd:{type:String,uppercase:true,default:''},
	ma_dt:{type:String,uppercase:true,default:''},
	ma_nv:{type:String,uppercase:true,default:''},
	line:{type:Number,default:0}
});
detailSchema.validate ={
	tk_co:validAccount.existsTk,
	ma_kh:validator.existsKh,
}
var tdttno_ttSchema = new Schema({
	id_hd:{type:String,required:true},
	ngay_hd:{type:Date,required:true},
	so_hd:{type:String,required:true,uppercase:true},
	
	ma_nt_hd:{type:String,required:true},
	ty_gia_hd:{type:Number,default:1},
	tien_hd_nt:{type:Number,default:0},
	da_thanh_toan_nt:{type:Number,default:0},
	con_lai_nt:{type:Number,default:0},
	
	tien_nt:{type:Number,default:0},
	tien:{type:Number,default:0},
	
	thanh_toan_qd:{type:Number,default:0},
	
	ma_kh:{type:String,uppercase:true,default:''},
	
	tk_co:{type:String,required:true},
	
	ma_bp:{type:String,default:'',uppercase:true},
	ma_phi:{type:String,default:'',uppercase:true},
	ma_hd:{type:String,default:'',uppercase:true},
	ma_dt:{type:String,default:'',uppercase:true},
	ma_nv:{type:String,default:'',uppercase:true},
});
tdttno_ttSchema.validate ={
	tk_co:validAccount.existsTk,
	ma_kh:validator.existsKh
}
var pt1Schema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String,required:true},
	ma_ct:{type:String,default:'pt1',required:true,uppercase:true},
	ma_gd:{type:String,default:'0'},
	so_ct:{type:String,required:true,uppercase:true,trim:true},
	ngay_ct:{type:Date,default:Date.now,required:true},
	ma_nt:{type:String,required:'ma_nt is required',default:'VND',trim:true,uppercase:true},
	ty_gia:{type:Number,required:true,min:0,default:1},
	tk_no:{type:String,uppercase:true,required:true},
	ma_kh:{type:String,uppercase:true,required:true},
	dien_giai:{type:String,default:''},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''},
	status: {type:String,default:'5'},
	details:{type:[detailSchema]},
	tdttnos:[tdttno_ttSchema]
});
pt1Schema.validate ={
	ma_dvcs:validator.existsDvcs,
	ma_nt:validator.existsNt,
	ngay_ct:validator.unlockBook,
	tk_no:validAccount.existsTk,
	ma_gd:[
		function(id_app,value,callback){
			if(value!="1" && value!="2"){
				return callback(false);
			}else{
				return callback(true);
			}
		}
		,"ma_gd:1-Thu tiền mặt, 2- Báo có"
	]
}
pt1Schema.index({id_app:1,ma_dvcs:1,so_ct:1,ngay_ct:1});
module.exports = mongoose.model('pt1',pt1Schema);