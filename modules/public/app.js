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
var app = require("../../models/app")
module.exports = function(router){
	router.route("/apps").get(function(req,res,next){
		var q = req.query.q;
		if(q){
			query = JSON.parse(q);
		}else{
			var key = req.query.k;
			query = {};
			if(key){
				query.$or = []
				query.$or.push({name:{$regex:key,$options:'i'}});
				query.$or.push({address:{$regex:key,$options:'i'}});
			}
		}
		query.sale_online = true;
		app.find(query,{name:1,logo:1,gioi_thieu:1,nganh_nghe:1}).lean().exec(function(error,apps){
			if(error) return res.status(400).send(error);
			apps.forEach(function(app){
				if(!app.logo){
					app.logo ="/getfile/others/noimage.png"
				}
			});
			res.send(apps)
		});
	});
	router.route("/apps/:id").get(function(req,res,next){
		var id_app = req.params.id
		app.findOne({_id:id_app,sale_online:true},{name:1,address:1,city:1,province:1,country:1,phone:1,fax:1,email:1,website:1,bao_hanh:1,van_chuyen:1,logo:1,gioi_thieu:1,nganh_nghe:1}).lean().exec(function(error,app){
			if(error) return res.status(400).send(error);
			
			if(!app.logo){
				app.logo ="/getfile/others/noimage.png"
			}
			res.send(app)
		});
	});
}