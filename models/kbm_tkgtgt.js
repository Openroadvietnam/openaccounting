var validAccount = require("../libs/validator-account");
var kbmTkgtgtSchema = new Schema({
	id_app:{type:String,required:true},
	stt:{type:Number,required:true},
	stt_in:{type:String,required:true},
	ma_so:{type:String,required:true},
	chi_tieu:{type:String,required:true},
	
	ma_in_tien:{type:String},
	ma_in_thue:{type:String},
	
	phan_loai:{type:String,required:true},
	
	print:{type:Boolean,default:true},
	bold:{type:Boolean,default:false},
	
	cach_tinh:{type:String,required:true},
	bang_du_lieu:{type:String,required:true},
	
	ma_thue:[String],
	ma_tc:[String],
	
	tk:{type:String},
	
	cong_thuc:{type:String},
	
	cong_thuc_doanh_so:{type:String},
	cong_thuc_thue:{type:String},
	t_tien:{type:Number,default:0},
	t_thue:{type:Number,default:0},

	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
kbmTkgtgtSchema.validate =  {
	tk: validAccount.existsAnyTk,
	phan_loai:[function(id_app,value,callback){
			if(value=='1' || value=='2'|| value=='3' || value=='4'){
				callback(true);
			}else{
				callback(false);
			}
		},'Kiểu hiện:1-Cả hai,2-Thuế,3-Doanh số,4-Không hiện'
	],
	cach_tinh:[function(id_app,value,callback){
			if(value=='1' || value=='2'){
				callback(true);
			}else{
				callback(false);
			}
		},'Cách tính:1-Mã số,2-theo phát sinh'
	]
	,
	bang_du_lieu:[function(id_app,value,callback){
			if(value=='vatvao' || value=='vatra'){
				callback(true);
			}else{
				callback(false);
			}
		},'Bảng dữ liệu:vatvao-thuế đầu vào,vatra-thuế đầu ra'
	]
};
kbmTkgtgtSchema.index({id_app:1,stt:1,ma_so:1});
module.exports = mongoose.model("kbmTkgtgt",kbmTkgtgtSchema);