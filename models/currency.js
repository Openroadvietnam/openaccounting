var currencySchema = new Schema({
	id_app:{type:String,required:true},
	ma_nt:{type:String,uppercase:true,required:true},
	ten_nt:{type:String,required:true},
	ty_gia:{type:Number,default:1,required:true},
	
	tk_cl_no:{type:String,default:''},
	tk_cl_co:{type:String,default:''},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
currencySchema.index({id_app:1,ma_nt:1});
module.exports =mongoose.model('currency',currencySchema);