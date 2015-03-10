var model = require("../../models/account");
var controller = require("../../controllers/controller");
var arrayfuncs = require("../../libs/array-funcs");
var account = function(router){
	var accountContr = new controller(router,model,"account",{
		sort: 		{tk:1},
		unique:		['tk']
	});
	//route
	accountContr.route();
	accountContr.view = function(user,items,fn){
		id_app = user.current_id_app;
		items.joinModel(id_app,model,[{akey:'tk_me',bkey:'tk',fields:[{name:'ten_tk_me',value:'ten_tk'}]}],function(kq){
			fn(null,items);
		});
	}
	accountContr.deleting=function(user,obj,next){
		if(obj.loai_tk==0){
			return next(new Error("don't delete mother account"));
		}else{
			next(null,obj);
		}
	}
	//event
	accountContr.on("saved",function(obj){
		var tk_me = obj.tk_me;
		if(tk_me && tk_me!=''){
			model.findOneAndUpdate({id_app:obj.id_app,tk:tk_me},{$set:{loai_tk:0}},function(error,obj){
				if(error) {
					console.error(error);
					return;
				}
				if(!obj){
					console.log("Not found mother account:" + tk_me);
				}else{
					console.log("updated " + obj.tk);
				}
			});
		}
	});
	accountContr.on("deleted",function(obj){
		if(obj.tk_me && obj.tk_me!=""){
			model.findOne({tk_me:obj.tk_me},function(error,acc){
				if(error) return;
				if(acc) return;
				model.findOneAndUpdate({id_app:obj.id_app,tk:obj.tk_me},{$set:{loai_tk:1}},function(error,obj){
					if(error) return;
					if(obj){
						console.log("updated " + obj.tk);
					}
					
				});
			})
		}
	});
}
module.exports = account;
