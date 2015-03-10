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
var model = require("../../models/sotinhkh");
var qts = require("../../models/qts");
var dmbp = require("../../models/dmbp");
var dmtk = require("../../models/account");
var controller = require("../../controllers/controller");
var async = require("async");
module.exports = function(router){
	var contr = new controller(router,model,'dckhauhaots',{
		sort:{nam:1,thang:1,so_the_ts:1}
	});
	contr.view = function(user,items,fn){
		id_app = user.current_id_app;
		async.parallel({
			ts:function(callback){
				items.joinModel(id_app,qts,[{akey:'so_the_ts',bkey:'so_the_ts',fields:[{name:'ten_ts',value:'ten_ts'}]}],function(kq){
					callback();
				});
			}
		},function(error,rs){
			if(error) return fn(error);
			fn(null,items);
		});
	}
	contr.route();
}
