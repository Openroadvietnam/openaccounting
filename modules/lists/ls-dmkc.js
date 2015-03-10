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
var model = require("../../models/dmkc");
var controller = require("../../controllers/controller");
var Dmtk = require("../../models/account");
var async =require("async");
var arrayfuncs = require("../../libs/array-funcs");

module.exports = function(router){
	var contr = new controller(router,model,'dmkc',{
		sort:{stt:1},
		unique:['stt']
	});
	contr.route();
	contr.view = function(user,items,fn){
		id_app = user.current_id_app;
		async.parallel([
			function(callback){
				items.joinModel(id_app,Dmtk,[{akey:'tk_chuyen',bkey:'tk',fields:[{name:'ten_tk_chuyen',value:'ten_tk'}]},
							{akey:'tk_nhan',bkey:'tk',fields:[{name:'ten_tk_nhan',value:'ten_tk'}]}
					]
				,function(rs){
					callback(null,rs);
				});
			}
			
		],function(error,results){
			fn(null,items);
		});
	}
}