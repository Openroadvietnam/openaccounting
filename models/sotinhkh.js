var sotinhkhScheam = new Schema({
	id_app:{type:String,required:true},
	nam:{type:Number,required:true},
	thang:{type:Number,required:true},
	so_the_ts:{type:String,required:true},
	id_ts:String,
	nguyen_gia:{type:Number,default:0},
	gia_tri_da_kh:{type:Number,default:0},
	gia_tri_con_lai:{type:Number,default:0},
	gia_tri_kh_ky:{type:Number,default:0},
	
	ngay_dau_thang:Date,
	ngay_cuoi_thang:Date,
	so_ngay_kh:Number,
	
	sua_kh:{type:Boolean,default:false},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
module.exports = mongoose.model("sotinhkh",sotinhkhScheam);