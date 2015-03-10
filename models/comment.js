var replySchema = new Schema({
	id_comment:{type:String,required:true},
	email:{type:String,required:true},
	name:{type:String,required:true},
	comment:{type:String,required:true},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now}
});
var commentSchema = new Schema({
	id_product:{type:String,required:true},
	email:{type:String,required:"Vui lòng nhập email"},
	name:{type:String,required:"Vui lòng nhập tên"},
	comment:{type:String,required:"Vui lòng nhập nội dung"},
	reply:[replySchema],
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
commentSchema.index({id_product:1});
var model = mongoose.model("comment",commentSchema);
module.exports = model