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
var dmnvt = require("../../models/dmnvt");
module.exports = function(router){
	router.route("/dmnvt").get(
		function(req,res,next){
			var id_app = req.query.id_app;
			var fields = req.query.fields;
			gfields={};
			if(fields){
				fields.split(",").forEach(function(f){
					if(f!='_id'){
						gfields[f] = 1;
					}
					
				});
			}
			var condition ={}
			if(req.query.q){
				condition = eval("(" + req.query.q + ")");
				
			}else{
				var k = req.query.k;
				if(k){
					condition.$or =[];
					condition.$or.push({ma_vt:{$regex:k,$options:'i'}})
					condition.$or.push({ten_vt:{$regex:k,$options:'i'}})
				}
			}
			condition.id_app = id_app
			query = dmnvt.find(condition,gfields);
			//page
			var page = req.query.page;
			var limit = req.query.limit;
			if(page){
				if(!limit){
					limit = 20;
				}
				var skip = (Number(page)-1) * limit;
				query.skip(skip).limit(limit);
			}else{
				if(limit){
					query.limit(limit);
				}
			}
			//
			var sort = req.query.sort;
			if(sort){
				var gsort ={}
				sort.split(",").forEach(function(f){
					if(f!='_id'){
						gsort[f] = 1;
					}
					
				});
				query.sort(gsort);
			}
			query.lean().exec(function(error,result){
				if(error) return res.status(400).send(error);
				res.send(result);
			});
		}
	);
}