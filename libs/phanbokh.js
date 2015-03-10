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
var sophanbokh = require("../models/sophanbokh");
var hspbts = require("../models/hspbts");
var sotinhkh = require("../models/sotinhkh");
var arrayfuncs = require("./array-funcs");
var async = require("async");
var underscore = require("underscore");
module.exports = function(kqtinhkh,fn){
	sophanbokh.remove({id_ts:kqtinhkh.id_ts,thang:kqtinhkh.thang,nam:kqtinhkh.nam},function(error){
		if(error) return fn(error);
		hspbts.find({id_app:kqtinhkh.id_app,so_the_ts:kqtinhkh.so_the_ts,thang:kqtinhkh.thang,nam:kqtinhkh.nam}).lean().exec(function(error,hss){
			if(error) return fn(error);
			var m = hss.csum("he_so");
			if(m!=0){
				hss.forEach(function(hs){
					underscore.extend(hs,kqtinhkh);
					hs.gia_tri_kh_ky = Math.round((hs.he_so/m) * kqtinhkh.gia_tri_kh_ky,0);
					delete hs["_id"];
				});
			}else{
				hss =[kqtinhkh];
			}
			sophanbokh.create(hss,function(error){
				if(error) return fn(error);
				fn(null,hss);
			})
			
		});
	});
}