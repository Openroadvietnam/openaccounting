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
var comment = require("../../models/comment");
var dmvt = require("../../models/dmvt");
var email = require("../../libs/email");
var array_funcs = require("../../libs/array-funcs");
var async = require("async");
var numeral = require('numeral');
module.exports = function(router){
	router.route("/comment/:id_product").post(
		function(req,res,next){
			var body = req.body;
			if(!body) return res.status(411).send("Không có dữ liệu");
			var id_product = req.params.id_product;
			var id_app = req.query.id_app;
			dmvt.findOne({_id:id_product}).lean().exec(function(error,product){
				if(error) return res.status(400).send("Sản phẩm này không tồn tại"); 
				var obj = new comment(body);
				obj.id_product = id_product;
				obj.save(function(error,result){
					if(error) return res.status(400).send(error);
					res.send(result);
				})
			});
			
		}
	);
}