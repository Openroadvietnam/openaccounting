var tdttcoSchema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String,required:true},
	id_ct:{type:String,required:true},
	ma_ct:{type:String,required:true,uppercase:true},
	ma_gd:{type:String,default:'0'},
	ngay_ct:{type:Date,required:true},
	so_ct:{type:String,required:true,uppercase:true},
	
	ngay_hd:{type:Date,required:true},
	so_hd:{type:String,required:true,uppercase:true},
	
	
	ma_nt:{type:String,default:'VND',required:true,uppercase:true},
	ty_gia:{type:Number,default:1},
	
	tien_nt:{type:Number,default:0},
	tien:{type:Number,default:0},

	tk_co:{type:String,required:true},
	
	

	ma_kh:{type:String,uppercase:true,default:''},
	dien_giai:{type:String,default:''},
	
	tat_toan:{type:Boolean,default:false},
	
	ma_bp:{type:String,default:'',uppercase:true},
	ma_phi:{type:String,default:'',uppercase:true},
	ma_hd:{type:String,default:'',uppercase:true},
	ma_dt:{type:String,default:'',uppercase:true},
	ma_nv:{type:String,default:'',uppercase:true},
	status:{type:String,required:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});

tdttcoSchema.index({id_app:1,ma_dvcs:1,id_ct:1,ngay_ct:1,ma_kh:1});
module.exports = mongoose.model('tdttco',tdttcoSchema);