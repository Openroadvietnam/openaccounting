var rightScheam = new Schema({
	email:{type:String,required:true},
	id_app:{type:String,required:true},
	module:{type:String,required:true},
	
	view:{type:Boolean,default:false},
	viewOfOther:{type:Boolean,default:false},
	add:{type:Boolean,default:false},
	update:{type:Boolean,default:false},
	delete:{type:Boolean,default:false},
	print:{type:Boolean,default:false},
	
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
rightScheam.index({email:1,id_app:1,module:1});
module.exports = mongoose.model("right",rightScheam);