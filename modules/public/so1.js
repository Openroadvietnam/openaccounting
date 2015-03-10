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
var so1 = require("../../models/so1");
var ptthanhtoan = require("../../models/ptthanhtoan");
var dmvt = require("../../models/dmvt");
var app = require("../../models/app");
var counter = require("../../models/counter");
var email = require("../../libs/email");
var array_funcs = require("../../libs/array-funcs");
var loadTemplate = require("../../libs/load-template");
var async = require("async");
var numeral = require('numeral');
module.exports = function(router){
	router.route("/so1").post(
		function(req,res,next){
			var body = req.body;
			if(!body) return res.status(411).send("Không có dữ liệu");
			var id_app = req.query.id_app;
			app.findOne({_id:id_app}).lean().exec(function(error,app){
				if(error) return res.status(400).send("Cửa hàng này không tồn tại"); 
				var obj = new so1(body);
				obj.id_app = id_app;
				counter.getNextSequence(id_app,"SO1","so_ct",function(error,so_ct){
					if(error) return res.status(400).send(error);
					obj.so_ct = so_ct;
					obj.save(function(error,result){
						if(error){
							var msgErrors =[];
							for(var k in error.errors){
								msgErrors.push(error.errors[k].message + "\n");
							}
							return res.status(400).send(msgErrors);
						}
						res.send(result);
						//send email to seller
						result.t_sl =result.details.csum('sl_xuat');
						result.t_tien_hang = result.details.csum('tien_hang');
						result.t_tien_hang_nt = result.details.csum('tien_hang_t');
						
						result.t_ck = result.details.csum('tien_ck') + result.tien_ck_hd;
						result.t_ck_nt = result.details.csum('tien_ck_nt') + result.tien_ck_hd;
						
						result.t_tt = result.t_tien_hang  - result.t_ck;
						result.t_tt_nt = result.t_tien_hang_nt  - result.t_ck_nt;
						
						var fm = '0,0'
						result.t_sl = numeral(result.t_sl).format(fm);
						result.t_tien_hang = numeral(result.t_tien_hang).format(fm);
						result.t_tien_hang_nt = numeral(result.t_tien_hang_nt).format(fm);
						
						result.t_ck = numeral(result.t_ck).format(fm);
						result.t_ck_nt = numeral(result.t_ck_nt).format(fm);
						
						result.t_tt = numeral(result.t_tt).format(fm);
						result.t_tt_nt = numeral(result.t_tt_nt).format(fm);
						async.parallel({
							vt: function(callback){
								result.details.joinModel(id_app,dmvt,[{akey:'ma_vt',bkey:'ma_vt',fields:[{name:'ten_vt',value:'ten_vt'}]}],function(kq){
									result.details.forEach(function(r){
										var row ="<tr>";
										row = row + "<td style='border:1px solid gray'>" + r.ma_vt + "</td>";
										row = row + "<td style='border:1px solid gray'>" + r.ten_vt + "</td>";
										row = row + "<td style='border:1px solid gray'>" + r.ma_dvt + "</td>";
										row = row + "<td style='border:1px solid gray'>" + numeral(r.sl_xuat).format(fm); + "</td>";
										row = row + "<td style='border:1px solid gray'>" + numeral(r.gia_ban_thuc).format(fm); + "</td>";
										row = row + "<td style='border:1px solid gray'>" + numeral(r.tien).format(fm); + "</td>";
										row = row + "</tr>"
										if(result.rows){
											result.rows = result.rows + row;
										}else{
											result.rows = row;
										}
									});
									callback(null)
								});
							},
							tt:function(callback){
								[result].joinModel(id_app,ptthanhtoan,[{akey:'pt_thanh_toan',bkey:'_id',fields:[{name:'ten_pt_thanh_toan',value:'ten'}]}],function(kq){
									callback(null)
								});
							}
						
						},function(e,rs){
							loadTemplate("order.html",{app:app,order:result},function(error,html){
								if(error) return console.log(error);
								email.sendHtml({sender:'CỬA HÀNG VIỆT',to:[{name:app.name,address:app.email},{name:result.ten_nguoi_nhan,address:result.email}],subject:"Đơn đặt hàng",html:html},function(error,info){
									if(error) {
										console.error("Khong the gui don dat hang\n" + error);
									}
								});
							});
						});
					});
				});
			});
			
		}
	);
}