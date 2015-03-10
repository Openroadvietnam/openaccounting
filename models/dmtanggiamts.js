var dmtanggiamtsSchema = new Schema({
	id_app:{type:String,required:true},
	kieu:{type:String,default:'1',required:true},
	ma_tang_giam_ts:{type:String,required:true,uppercase:true},
	ten_tang_giam_ts:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmtanggiamtsSchema.validate ={
	kieu:[function(id_app,value,callback){
		if(value=='1' || value=='2'){
			callback(true);
		}else{
			callback(false);
		}
	}
	,"Kiểu(kieu): 1- tăng, 2- giảm"]
}
dmtanggiamtsSchema.index({id_app:1,ma_tang_giam_ts:1,ten_tang_giam_ts:1});
module.exports = mongoose.model("dmtanggiamts",dmtanggiamtsSchema);