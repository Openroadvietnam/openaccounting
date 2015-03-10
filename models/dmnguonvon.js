var dmnguonvonSchema = new Schema({
	id_app:{type:String,required:true},
	ma_nguon_von:{type:String,required:true,uppercase:true},
	ten_nguon_von:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
dmnguonvonSchema.index({id_app:1,ma_nguon_von:1,ten_nguon_von:1});
module.exports = mongoose.model("dmnguonvon",dmnguonvonSchema);