var counterScheam = new Schema({
	id_app:{type:String,required:true},
	name:{type:String,required:true},
	field:{type:String,required:true},
	sequence:{type:Number}
	
});
counterScheam.index({id_app:1,name:1});
var model= mongoose.model("counter",counterScheam);
model.getNextSequence = function(id_app,name,field,fn){
	model.findOneAndUpdate({id_app:id_app,name:name,field:field},{$inc: { sequence: 1 }},{new:true,upsert: true},function(error,obj){
		if(error) return fn(error);
		if(!obj){
			return fn(null,-1);
		}
		return fn(null,obj.sequence);
	});
}
module.exports = model