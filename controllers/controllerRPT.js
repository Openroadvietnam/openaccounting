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
var nodezip = require("node-zip");
var eletree = require("elementtree");
var underscore = require("underscore");
var fs = require("fs");
var path = require("path")
var permission = require("../libs/permission")
var excelReport = require("excel-report")
var app = require("../models/app")
var log = require("../models/log")
var controllerRPT = function(router,rptId,getData,options){
	this.module = rptId
	var module = this.module;
	router.route("/:id_app/" + this.module).get(function(req,res,next){
		var id_app = req.params.id_app;
		permission.hasRight(id_app,req.user.email,module,"view",function(error,permission){
			if(permission){
				getData(req,function(error,data){
					if(error) return res.status(400).send(error);
					//log
					log.create({id_app:req.user.current_id_app,id_func:rptId,action:'VIEWRPT',data:{condition:JSON.stringify(req.query)}},req.user.email,req.header('user-agent'),req)
					//
					res.send(data);
				});
			}else{
				res.status(403).send("Bạn không có quyền xem báo cáo này")
			}
		})
		
	});
	//export to excel
	router.route("/:id_app/" + this.module + "/excel").get(function(req,res,next){
		var id_app = req.params.id_app;
		if(req.query.tu_ngay){
			req.query.tu_ngay = new Date(req.query.tu_ngay);
		}
		if(req.query.den_ngay){
			req.query.den_ngay = new Date(req.query.den_ngay);
		}
		permission.hasRight(id_app,req.user.email,module,"view",function(error,permission){
			if(permission){
				getData(req,function(error,data){
					if(error) return res.status(400).send(error);
					//log
					log.create({id_app:req.user.current_id_app,id_func:rptId,action:'EXCELRPT',data:{condition:JSON.stringify(req.query)}},req.user.email,req.header('user-agent'),req)
					//
					if(data.length==0){
						return res.status(400).send("Không có dữ liệu");
					}
					var templatePath = __dirname +  "/xlsx/" + module + ".xlsx";
					app.findOne({_id:id_app},function(error,app){
						if(error) return res.status(400).send("Không tồn tại app này");
						underscore.extend(app,req.query);
						app.detail = data;
						excelReport(templatePath,app,function(error,result){
							if(error) return res.status(400).send(error);
							res.setHeader('Content-Type', 'application/vnd.openxmlformats');
							res.setHeader("Content-Disposition", "attachment; filename=" + rptId + ".xlsx");
							res.end(result, 'binary');
						});
					});	
				});
			}else{
				res.status(403).send("Bạn không có quyền xuất excel báo cáo này")
			}
		})
		
	});
}
module.exports = controllerRPT;