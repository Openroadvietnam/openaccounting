/*Copyright (C) 2015  Sao Tien Phong (http://saotienphong.com.vn)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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
