var participantScheam = new Schema({
	email:{type:String,required:true},
	admin:{type:Boolean,default:false},
	active:{type:Boolean,default:false},
	cancel:{type:Boolean,default:false},
	date_created:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	date_updated:{type:Date,default:Date.now},
	user_updated:{type:String,default:''}
});
var appScheam = new Schema({
	name:{type:String,required:true},
	address:{type:String,default:""},
	city:{type:String,default:""},
	province:{type:String,default:""},
	country:{type:String,default:""},
	phone:{type:String,default:""},
	fax:{type:String,default:""},
	email:{type:String,default:""},
	website:{type:String,default:""},
	sale_online:{type:Boolean,default:false},
	
	bao_hanh:{type:String},
	van_chuyen:{type:String},
	gioi_thieu:{type:String},
	nganh_nghe:{type:String},
	
	ngay_dn:{type:Date,required:true},//ngay bat dau su dung chuong trinh
	ngay_ks:{type:Date,required:true},
	nam_bd:{type:Number,required:true},
	ngay_ky1:{type:Date,required:true},//ngay bat dau nam tai chinh
	
	ma_so_thue:String,
	nguoi_nop_thue:String,
	giam_doc:String,
	ke_toan_truong:String,
	logo:String,
	
	participants:[participantScheam],
		
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
appScheam.index({name:1,province:1});
module.exports = mongoose.model("app",appScheam);