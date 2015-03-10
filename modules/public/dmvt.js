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
var dmvt = require("../../models/dmvt");
module.exports = function(router){
	router.route("/dmvt").get(
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
				var ma_nvt = req.query.ma_nvt;
				if(ma_nvt && ma_nvt!=''){
					condition.ma_nvt = ma_nvt
				}
			}
			condition.id_app = id_app
			condition.status = true
			query = dmvt.find(condition,gfields);
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
			}else{
				query.sort({date_updated:-1});
			}
			query.lean().exec(function(error,result){
				if(error) return res.status(400).send(error);
				result.forEach(function(r){
					if(!r.picture){
						r.picture ="/getfile/others/noimage.png"
						r.picture_thumb = "/getfile/others/noimage.png"
					}else{
						var p =  r.picture.split(".")
						r.picture_thumb = r.picture + ".thumb." +  p[p.length-1]
					}
					
					if(r.picture2){
						var p =  r.picture2.split(".")
						r.picture2_thumb = r.picture2 + ".thumb." +  p[p.length-1]
					}
					if(r.picture3){
						var p =  r.picture3.split(".")
						r.picture3_thumb = r.picture3 + ".thumb." +  p[p.length-1]
					}
					if(r.picture4){
						var p =  r.picture4.split(".")
						r.picture4_thumb = r.picture4 + ".thumb." +  p[p.length-1]
					}
					if(r.picture5){
						var p =  r.picture5.split(".")
						r.picture5_thumb = r.picture5 + ".thumb." +  p[p.length-1]
					}
					
					if(!r.tien_ck) r.tien_ck =0
					if(!r.ty_le_ck) r.ty_le_ck =0
					if(r.ty_le_ck==0 && r.tien_ck!==0 && r.gia_ban_le!=0) r.ty_le_ck = Math.round((r.tien_ck/r.gia_ban_le) * 100,2)
					r.gia_ban_thuc= r.gia_ban_le - r.tien_ck
					
				});
				res.send(result);
			});
		}
	);
}