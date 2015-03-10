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