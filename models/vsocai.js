var vsocaiSchema = new Schema({
	id_app:{type:String,required:true},
	ma_dvcs:{type:String,required:true},
	id_ct:{type:String,required:true},
	ma_ct:{type:String,required:true,uppercase:true},
	ma_gd:{type:String,default:'0'},
	ngay_ct:{type:Date,required:true},
	so_ct:{type:String,required:true,uppercase:true},
	
	tk:{type:String,required:true,uppercase:true},
	tk_du:{type:String,required:true,uppercase:true},
	
	ma_kh:{type:String,uppercase:true,default:''},
	
	ma_nt:{type:String,default:'VND',required:true,uppercase:true},
	ty_gia:{type:Number,default:1},
	
	ps_no_nt:{type:Number,default:0,required:true},
	ps_no:{type:Number,default:0,required:true},
	ps_co_nt:{type:Number,default:0,required:true},
	ps_co:{type:Number,default:0,required:true},
	
	dien_giai:{type:String,default:''},
	
	ma_bp:{type:String,default:'',uppercase:true},
	ma_phi:{type:String,default:'',uppercase:true},
	ma_hd:{type:String,default:'',uppercase:true},
	ma_dt:{type:String,default:'',uppercase:true},
	ma_nv:{type:String,default:'',uppercase:true},
	ma_sp:{type:String,default:'',uppercase:true},
	
	status:{type:String,required:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''},
	nh_dk:{type:Number,default:0}
});

vsocaiSchema.index({id_app:1,ma_dvcs:1,ngay_ct:1,tk:1,tk_du:1,ma_kh:1});
module.exports = mongoose.model('vsocai',vsocaiSchema);