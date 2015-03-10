var giatbSchema = new Schema({
	id_app:{type:String,required:true},
	nam:{type:Number,required:true,default:0},
	thang:{type:Number,required:true,default:0},
	ma_vt:{type:String,required:true,uppercase:true},
	ma_kho:{type:String,uppercase:true},
	ton_dau:{type:Number,default:0},
	du_dau:{type:Number,default:0},
	sl_nhap:{type:Number,default:0},
	tien_nhap:{type:Number,default:0},
	tong_sl:{type:Number,default:0},
	tong_tien:{type:Number,default:0},
	gia:{type:Number,default:0},
	
	status:{type:String,required:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});

giatbSchema.index({id_app:1,ma_dvcs:1,nam:1,thang:1,ma_vt:1,ma_kho:1});
module.exports = mongoose.model('giatb',giatbSchema);