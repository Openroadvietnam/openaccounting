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
var model = require("../../models/user");
var usersAdmin = require("../../configs").admins;
var underscore = require("underscore");
var async = require("async");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'users',{
		require_id_app:false,
		sort:{email:1}
	});
	contr.route();
	contr.view = function(user,items,fn){
		items.forEach(function(item){
			if(!item.status && item.status!=false){
				item.status=true;
			}
		})
		fn(null,items);
	}
	contr.getting = function(user,id,next){
			if(!underscore.contains(usersAdmin,user.email)){
				return next("Bạn không có quyền truy cập đối tượng này");
			}else{
				return next();
			}
	}		
	contr.finding = function(user,condition,next){
		if(!underscore.contains(usersAdmin,user.email)){
			return next("Bạn không có quyền truy cập đối tượng này");
		}else{
			return next(null,condition);
		}
	}
		
	contr.creating = function(user,obj,next){
		return next("Không thể tạo người sử dụng mới theo cách này");
		
	},
	contr.updating = function(user,data,obj,next){
		if(!underscore.contains(usersAdmin,user.email)){
			return next("Bạn không có quyền cập nhật người sử dụng này");
		}else{
			return next(null,data,obj);
		}
			
	}	
	contr.deleting = function(user,obj,next){
		if(!underscore.contains(usersAdmin,user.email)){
			return next("Bạn không có quyền xóa người sử dụng này");
		}
		next(null,obj);
	}

}
