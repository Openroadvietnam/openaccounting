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
var model = require("../../models/right");
var User = require("../../models/user");
var Notification = require("../../models/notification");
var underscore = require("underscore");
var async = require("async");
var controller = require("../../controllers/controller");
module.exports = function(router){
	var contr = new controller(router,model,'right',{
		require_id_app:true,
		sort:{name:1},
		unique:	['id_app','email','module']
	});
	contr.route();
}
