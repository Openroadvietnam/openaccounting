var events = require("events"); 
var underscore = require("underscore");
var post = function(master,details,model_book,prepare){
	if(!details){
		return;
	}
	this.master = master.toObject();
	if(underscore.isObject(details)){
		this.details = details;
	}else{
		this.details = details.toObject();
	}
	
	this.model_book = model_book;
	this.prepare = prepare;
	if(!this.prepare){
		this.prepare = function(obj,callback){
			callback(obj);
		}
	}
}
post.prototype.run = function(callback){
	if(!this.details){
		return;
	}
	var master = this.master;
	var details = this.details;
	var model_book = this.model_book;
	var eventEmitter = this;
	console.log("posting book ma_ct:" + master.ma_ct + ",so_ct:" + master.so_ct);
	model_book.remove({id_ct:master._id},function(error){
		if(error) return console.error(error);
		details.forEach(function(detail){
			eventEmitter.prepare(detail,function(detail){
				book = new model_book();
				//prepare data
				book.set('id_ct',master._id);
				for(var attr in model_book.schema.paths){
					if(attr!="id_ct" && attr!="_id"){
						v = detail[attr];
						if(v){
							book.set(attr,v);
						}else{
							v = master[attr];
							if(v){
								book.set(attr,v);
							}
						}
					}
					
				}

				//post
				book.save(function(error,kq){
					if(error) { 
						console.log(error);
						return;
					}
					if(callback){
						callback(kq);
					}
				});
			});
			
		});
	});
}
module.exports = post;