var customerSchema = new Schema({
	id_app:{type:String,required:true},
	ma_kh:{type:String,uppercase:true,default:'',trim:true},
	ten_kh:{type:String,required:'ten_kh is required',trim:true},
	dia_chi:{type:String,default:''},
	dien_thoai:{type:String,default:''},
	fax:{type:String,default:''},
	email:{type:String,default:''},
	ma_so_thue:{type:String,default:''},
	loai_kh:{type:String,default:'',trim:true},
	nh_kh1:{type:String,default:'',trim:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
customerSchema.index({id_app:1,ma_kh:1,ten_kh:1});
var model = mongoose.model('customer',customerSchema);
model.referenceKeys ={
	ma_kh:[
		{model:"vsocai",key:'ma_kh',error:'Khách hàng {{VALUE}} đã phát sinh dữ liệu'},
		{model:"cdkh",key:'ma_kh',error:'Khách hàng {{VALUE}} đã phát sinh dữ liệu'}
	]
}
module.exports = model