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
var bgaccs = require("../../libs/dktk");
var arrayfuncs = require("../../libs/array-funcs");
var Account = require("../../models/account");
var underscore = require("underscore");
var async = require("async");
var controller = require("../../controllers/controllerRPT");
module.exports = function(router){
	var rpt = new controller(router,"dktk",function(req,callback){
		var condition = req.query;
		var bu_tru = condition.bu_tru;
		if(!bu_tru){
			bu_tru = false;
		}
		bgaccs(condition,function(error,report){
			if(error) return callback(error);
			//lay ten cua tai khoan
			report.joinModel(condition.id_app,Account,[{akey:'tk',bkey:'tk',fields:[{name:'ten_tk',value:'ten_tk'}]}],function(results){
				callback(null,results);
			});
			
		});

	}); 
	
}