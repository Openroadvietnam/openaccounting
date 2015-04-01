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
var EventEmitter = require("events").EventEmitter;
var underscore = require("underscore");
var excelReport = require("excel-report")
var validate = require("../libs/validate");
var vsocai = require("../models/vsocai");
var Socai = require("../models/socai");
var rpt = require("../models/rpt");
var log = require("../models/log");
var app = require("../models/app");
var counter = require("../models/counter");
var async = require("async");
var excel = require("../libs/excel")
var permission = require("../libs/permission")
var request =require("request")
var fs = require("fs");
var bodyToJson = function(body){
	if(body.json){
		body = eval("(" + body.json + ")");
	}
			
	return body;
}
var isExists = function(model,unique,obj,fn){
	if(!unique || unique.length==0 ) return fn(null,false);
	var condition;
	if(!obj.id_app){
		condition ={};
	}else{
		condition ={id_app:obj.id_app};
	}
	for(var i=0;i<unique.length;i++){
		var key = unique[i];
		var v = obj[key];
		if(v){
			condition[key] = v;
		}else{
			return fn(null,false);
		}
	}
	
	model.findOne(condition,{_id:1},function(error,result){
		if(error) return fn(error);
		if(!result) return fn(null,false);
		fn(null,true);
	});
	
}
var controller = function(router,model,name,options){
	this.name = name;
	this.model = model;
	this.router = router;
	this.module = this.name;
	if(!options){
		options ={};
	}
	if(options.require_id_app==undefined || options.require_id_app == true){
		this.route_name = "/:id_app/" + this.module;
	}else{
		this.route_name = "/" + this.module;
	}
	
	
	this.sort = options.sort;
	this.unique = options.unique;
	
}

controller.prototype.__proto__ = EventEmitter.prototype;
controller.prototype.getNextId = function(){
	var ma_ct = this.name;
	this.router.route(this.route_name + "/next/:field").get(function(req,res,next){
		var id_app = req.user.current_id_app
		var field = req.params.field;
		counter.getNextSequence(id_app,ma_ct,field,function(error,sequence){
			if(error) {
				return res.status(400).send(error)
			}else{
				var rs ={};
				rs[field] = sequence;
				return res.send(rs);
			}
			
		});
	});
	
}
controller.prototype.find = function(){
	var sort = this.sort;
	var model = this.model;
	var ctrl = this;
	this.router.route(this.route_name).get(function(req,res,next){
		var condition = {};
		var or = [];
		for(var k in req.query){
			if(k=="id_app" || k=="access_token"){
				continue;
			}
			if(k=="_id"){
				try{
					var id = mongoose.Types.ObjectId(req.query._id);
					or.push({_id:id});
				}catch(error){
				
				}
				continue;
			}
			if(k=="q"){
				var q = eval("(" + req.query[k] + ")");
				condition = q;
				continue;
			}
			if(underscore.has(model.schema.paths,k)==true){
				var item ={};
				item[k] = {$regex: req.query[k],$options:'i'};
				or.push(item);
			}
		}
		if(or.length!=0){
			condition.$or = or;
		}
		if(underscore.has(model.schema.paths,"id_app")==true){
			condition.id_app = req.user.current_id_app;
		}
		if(ctrl.finding){
			ctrl.finding(req.user,condition,function(error,condition){
				if(error){
					return res.status(400).send(error);
				}
				req.condition = condition;
				next();
			});
		}else{
			req.condition = condition;
			next();
		}
		
	},
	function(req,res,next){
		var condition = req.condition;
		var query = null;
		if(req.query.count==1){
			query = model.count(condition,function(error,data){
				if(error) return res.status(400).send(error);
				res.send({"rows_number":data});
			});
			return;
		}else{
			var fields = req.query.fields;
			gfields={};
			if(fields){
				fields.split(",").forEach(function(f){
					if(f!='_id'){
						gfields[f] = 1;
					}
					
				});
			}
			query = model.find(condition,gfields);
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
			if(sort){
				query.sort(sort);
			}
			query.exec(function(error,obj){
				if(error) return res.status(400).send(error);
				//log
				log.create({id_app:req.user.current_id_app,id_func:ctrl.name,action:'FIND',data:{condition:JSON.stringify(condition)}},req.user.email,req.header('user-agent'),req)
				//send result
				if(!obj) return res.send([]);
				
				var obj4view =[];
				obj.forEach(function(o){
					obj4view.push(o.toObject());
				})
				
				if(!ctrl.view){
					res.send(obj4view);
				}else{
					var rows =obj4view;
					ctrl.view(req.user,rows,function(error,viewValue){
						if(error){
							return next(error);
						}
						res.send(viewValue);
					});
				}
				
			});
		}
		
		
	}
	
	);
	
}
controller.prototype.get = function(){
	var sort = this.sort;
	var model = this.model;
	var ctrl = this;
	this.router.route(this.route_name +"/:id").get(function(req,res,next){
		if(req.params.id == undefined){
			return res.status(404).send("Lỗi: Đối tượng này không tồn tại");
		}
		
		query = model.findById(req.params.id,function(err,obj){
			if(err) return res.status(400).send(err);
			//log
			log.create({id_app:req.user.current_id_app,id_func:ctrl.name,action:'GET',data:{id:req.params.id}},req.user.email,req.header('user-agent'),req)
			//
			if(!obj) return res.status(404).send("Lỗi: Không thể tìm thấy đối tượng này");
			if(underscore.has(model.schema.paths,"id_app")==true && req.user.current_id_app!=obj.id_app){
				return res.status(403).send("Lỗi: Không có quyền truy cập đối tượng này");
			}
			if(ctrl.getting){
				ctrl.getting(req.user,req.params.id,function(error){
					if(error){
						return res.status(400).send(error);
					}else{
						req.obj = obj;
						next();
					}
				},obj);
			}else{
				req.obj = obj;
				next();
			}
			
		});
	},
	function(req,res,next){
			obj = req.obj;
			if(obj){
				obj = obj.toObject();
			}
			if(ctrl.view && obj){
				result=obj;
				ctrl.view(req.user,[result],function(error,viewValue){
					if(error){
						return res.status(400).send(error);
					}
					res.send(viewValue[0]);
				});
			}else{
				res.send(obj);
			}
			
		}
	);
	
}
controller.prototype.getSocai = function(){
	var sort = this.sort;
	var model = this.model;
	var ctrl = this;
	this.router.route(this.route_name +"/socai/:id").get(function(req,res,next){
		var id = req.params.id;
		var id_app = req.query.id_app;
		Socai.find({id_ct:id,id_app:id_app},function(error,result){
			if(error) return res.status(400).send(error);
			var obj4view =[];
			result.forEach(function(o){
				obj4view.push(o.toObject());
			})
			res.send(obj4view);
		});
	}
	);
	
}
controller.prototype.getVsocai = function(){
	var sort = this.sort;
	var model = this.model;
	var ctrl = this;
	this.router.route(this.route_name +"/vsocai/:id").get(function(req,res,next){
		var id = req.params.id;
		var id_app = req.query.id_app;
		vsocai.find({id_ct:id,id_app:id_app},function(error,result){
			if(error) return res.status(400).send(error);
			
			var obj4view =[];
			result.forEach(function(o){
				obj4view.push(o.toObject());
			})
			res.send(obj4view);
		});
	}
	);
	
}
controller.prototype.exportToExcel = function(){
	var sort = this.sort;
	var model = this.model;
	var ctrl = this;
	this.router.route(this.route_name +"/excel/:rpt_id").get(
		function(req,res,next){
			var id = req.query._id;
			var id_app = req.query.id_app;
			if(!id){
				return res.status(400).send("Hàm này yêu cầu tham số _id");
			}
			model.findById(id,function(err,obj){
				if(err) return res.status(400).send(err);
				//log
				log.create({id_app:req.user.current_id_app,id_func:ctrl.name,action:'ExportTOExcel',data:{id:id}},req.user.email,req.header('user-agent'),req)
				//
				if(!obj) return res.status(404).send("Lỗi: Không thể tìm thấy đối tượng này");
				if(underscore.has(model.schema.paths,"id_app")==true && req.user.current_id_app!=obj.id_app){
					return res.status(403).send("Lỗi: Không có quyền truy cập đối tượng này");
				}
				if(ctrl.getting){
					ctrl.getting(req.user,req.params.id,function(error){
						if(error){
							return res.status(400).send(error);
						}else{
							req.obj = obj;
							next();
						}
					},obj);
				}else{
					req.obj = obj;
					next();
				}
				
			});
		},
		function(req,res,next){
			obj = req.obj;
			if(obj){
				obj = obj.toObject();
			}
			if(ctrl.view && obj){
				result=obj;
				ctrl.view(req.user,[result],function(error,viewValue){
					if(error){
						return res.status(400).send(error);
					}
					req.obj = viewValue[0];
					next();
				});
			}else{
				req.obj = obj;
				next();
			}
			
		},
		function(req,res,next){
			var rpt_id = req.params.rpt_id;
			var id_app = req.query.id_app;
			rpt.findById(rpt_id,function(error,rs){
				if(error){
					res.status(400).send(error);
				}
				//
				var obj = req.obj;
				var path = require("path");
				var templatePath = path.dirname(__dirname) + "/" +  rs.file_mau_in;
				if(!fs.existsSync(templatePath)){
					
					return res.status(400).send("File mẫu không tồn tại");
				}
				app.findOne({_id:id_app},function(error,app){
					if(error) return res.status(400).send("Không tồn tại app này");
					underscore.extend(app,req.query);
					underscore.extend(app,obj);
					excelReport(templatePath,app,function(error,result){
						if(error) return res.status(400).send(error);
						res.setHeader('Content-Type', 'application/vnd.openxmlformats');
						res.setHeader("Content-Disposition", "attachment; filename=" + ctrl.name + ".xlsx");
						res.end(result, 'binary');
					});
				});	
			});
		}
	);
	
}
controller.prototype.importFromExcel = function(){
	var module = this.module;
	this.router.route(this.route_name + "/import/excel").post(function(req,res,next){
		if(!req.files.xlsx){
			return res.status(400).send("Không tìm thấy file xlsx");
		}
		
		var filePath =  "./" +  req.files.xlsx.path;
		excel.parse(filePath,function(error,data,columns){
			fs.unlink(filePath,function(error){
				if(error){
					console.log("Can't delete file tmp:" + filePath);
				}
			});
			if(error) return res.status(400).send(error)
			//log
			log.create({id_app:req.user.current_id_app,id_func:ctrl.name,action:'IMPORTEXCEL',data:{data:data,columns:columns}},req.user.email,req.header('user-agent'),req)
			//
			var url = "http://localhost:" + port + "/api/" + req.params.id_app + "/" + module + "?access_token=" + req.query.access_token
			var rows_error =[]
			async.map(data,function(row,callback){
				request.post({url:url,form:row},function(error,httpResponse,body){
					if(error || httpResponse.statusCode!=200) {
						rows_error.push({row:row,error:body})
					}
					callback();
				});
			},function(error,result){
				if(error) return res.status(400).send(error)
				if(rows_error.length==0){
					res.send("<h3>Đã import thành công</h3>");
				}else{
					var table ="<h3>Không thể import những dòng sau:</h3><table><tr>"
					for(c in columns){
						table = table + "<th>" +  columns[c] + "<th>"
					}
					table = table + "<th>Lỗi<th>"
					table = table + "</tr>";
					rows_error.forEach(function(r){
						
						table = table + "<tr>";
						for(c in columns){
							table = table + "<td>" +  r.row[c] + "<td>"
						}
						table = table + "<td style='color:red'>" +  r.error + "<td>"
						table = table + "</tr>";
					});
					res.send(table);
				}
				
			});
		
			
		});
		
		
	});
}
controller.prototype.create =function(){
	var model = this.model;
	var name = this.name;
	var unique = this.unique;
	var ctrl = this;
	var module = this.module;
	this.router.route(this.route_name).post(
		function(req,res,next){
			var body = req.body;
			if(!body) return res.send(411,"Không có nội dung cần lưu");
			var obj = new model(bodyToJson(body));
			if(underscore.has(model.schema.paths,"id_app")==true){
				obj.id_app = req.user.current_id_app;
			}
			permission.hasRight(obj.id_app,req.user.email,module,"add",function(error,permission){
				if(!permission){
					return res.status(403).send("Bạn không có quyền thêm mới");
				}else{
					if(ctrl.creating){
						ctrl.creating(req.user,obj,function(error,obj){
							if(error){
								return res.status(400).send(error);
							}
							req.obj = obj;
							next();
						});
					}else{
						req.obj = obj;
						next();
					}
				}
			})
		
		},
		function(req,res,next){
			var obj = req.obj;
			obj.user_created = req.user.email;
			obj.user_updated = req.user.email;
			//validator
			validate(obj,function(error){
				if(error) return res.status(400).send(error);
				next();
			});
			
		},
		function(req,res,next){
			var obj = req.obj;
			//check exists
			isExists(model,unique,obj,function(error,kq){
				if(error) return res.status(400).send(error);
				if(kq==true){
					return res.status(400).send('Lỗi: Đã tồn tại đối tượng này');
				}
				//set ngay_ct
				if(obj['ngay_ct']){
					var ngay_ct = obj['ngay_ct'];
					ngay_ct = new Date(Date.UTC(ngay_ct.getFullYear(),ngay_ct.getMonth(),ngay_ct.getDate()));
					//ngay_ct = moment(moment.utc(ngay_ct).startOf('day').format('LL')).startOf('day').toDate();
					obj['ngay_ct'] = ngay_ct;	
				}
				//save to database
				ctrl.emit('saving',obj);
				obj.save(function(error,obj_created){
					if(error){
						var msgErrors =[];
						for(var k in error.errors){
							msgErrors.push(error.errors[k].message);
						}
						return res.status(400).send(msgErrors);
					}
					//log
					log.create({id_app:req.user.current_id_app,id_func:ctrl.name,action:'ADD',data:obj},req.user.email,req.header('user-agent'),req)
					//
					ctrl.emit('saved',obj_created);
					if(ctrl.post){
						ctrl.post(obj_created);
					}
					obj_created =obj_created.toObject();
					if(ctrl.view){
						ctrl.view(req.user,[obj_created],function(error,viewValue){
							if(error){
								return res.status(400).send(error);
							}
							req.obj = viewValue[0];
							next();
						});
					}else{
						req.obj = obj_created;
						next();
					}
					
				});
			})
			
		},
		function(req,res,next){
			var obj = req.obj;
			if(ctrl.created){
				ctrl.created(req.user,obj,function(error,obj){
					if(error){
						return res.status(400).send(error);
					}
					res.send(obj);
				});
			}else{
				res.send(obj);
			}
		}
	);
}
controller.prototype.update = function(){
	var model = this.model;
	var name = this.name;
	var unique = this.unique;
	var ctrl = this;
	var module = this.module;
	this.router.route(this.route_name +"/:id").put(
		function(req,res,next){
			model.findOne({_id:req.params.id},function(error,obj){
				if(error) return res.status(400).send(error);
				if(!obj || obj.id_app !=req.user.current_id_app) return res.status(404).send("Lỗi: Không thể tìm thấy đối tượng này");
				data = bodyToJson(req.body);
				if(data.id_app){
					if(data.id_app != req.user.current_id_app){
						return res.status(403).send("Lỗi: Không có quyền truy cập đối tượng này");
					}
				}
				permission.hasRight(obj.id_app,req.user.email,module,"update",function(error,permission){
					if(!permission){
						return res.status(403).send("Bạn không có quyền cập nhật đối tượng này");
					}else{
						req.data = data;
						req.obj = obj;
						next();
					}
				});
				
			});
		},
		function(req,res,next){
			obj = req.obj;
			data = req.data;
			
			if(ctrl.updating){
				ctrl.updating(req.user,data,obj,function(error,data,obj){
					if(error){
						return res.status(400).send(error);
					}
					req.data = data;
					req.obj = obj;
					next();
				});
			}else{
				req.data = data;
				req.obj = obj;
				next();
			}
		},
		function(req,res,next){
			if(!unique || unique.length==0){
				return next();
			}
			//
			obj = req.obj;
			data = req.data;
			//compare
			var c1 ={};
			var c2 ={};
			if(obj.id_app){
				c1.id_app = obj.id_app;
				if(!c2.id_app){
					c2.id_app = obj.id_app;
				}
			}
			unique.forEach(function(key){
				c1[key] = obj[key];
				c2[key] = data[key];
				if(!c2[key]){
					c2[key] = c1[key];
				}
			});
			if(underscore.isEqual(c1,c2)!=true){
				//check exists
				isExists(model,unique,c2,function(error,kq){
					if(error) return next(error);
					if(kq==true){
						return res.status(400).send("Lỗi: Đối tượng này đã tồn tại");
					}
					//check referenceKeys
					checkReference(model,obj,function(error){
						if(error) {
							error ="Lỗi: Không thể cập nhật do:\n" + error;
							return res.status(400).send(error)
						}
						next();
					});
				});
			}else{
				next();
			}
			
		},
		function(req,res,next){
			var obj = req.obj;
			var data = req.data;
			data.date_updated = new Date();
			data.user_updated = req.user.email;
			//log
			log.create({id_app:req.user.current_id_app,id_func:ctrl.name,action:'UPDATE',data:{oldData:obj,newData:data}},req.user.email,req.header('user-agent'),req)
			//
			underscore.extend(obj,data);
			//validator
			validate(obj,function(error){
				if(error) return res.status(400).send(error);
				next();
			});
		},
		function(req,res,next){
			obj = req.obj;
			//set ngay_ct
			if(obj['ngay_ct']){
				var ngay_ct = obj['ngay_ct'];
				ngay_ct = new Date(Date.UTC(ngay_ct.getFullYear(),ngay_ct.getMonth(),ngay_ct.getDate()));
				obj['ngay_ct'] = ngay_ct;	
			}
			ctrl.emit('saving',obj);
			obj.save(function(error,obj_created){
				if(error){
					var msgErrors =[];
					for(var k in error.errors){
						msgErrors.push(error.errors[k].message);
					}
					return res.status(400).send(msgErrors);
				}
				ctrl.emit('saved',obj_created);
				if(ctrl.post){
					ctrl.post(obj_created);
				}
				obj_created = obj_created.toObject();
				if(ctrl.view){
					ctrl.view(req.user,[obj_created],function(error,viewValue){
						if(error){
							return res.status(400).send(error);
						}
						req.obj = viewValue[0];
						next();
					});
				}else{
					req.obj = obj_created;
					next();
				}
			});
		
		},
		function(req,res,next){
			var obj = req.obj;
			if(ctrl.updated){
				ctrl.updated(req.user,obj,function(error,obj){
					if(error){
						return res.status(400).send(error);
					}
					res.send(obj);
				});
			}else{
				res.send(obj);
			}
		}
	);
}
function checkReference(model,obj,fn){
	if(model.referenceKeys){
		var keys =underscore.keys(model.referenceKeys);
		async.map(keys,function(key,callback){
			var ref = model.referenceKeys[key];
			var value = obj[key];
			async.map(ref,function(r,cb){
				var model = require("../models/" + r.model );
				var k = r.key;
				var query ={id_app:obj.id_app};
				query[k] = value;
				model.findOne(query).lean().exec(function(error,o){
					if(error) return cb(error);
					if(o) {
						var msgError ="Đối tượng {{VALUE}} đã phát sinh dữ liệu"
						if(r.error){
							msgError = r.error.replace("\{\{VALUE\}\}",value);
						}
						return cb(msgError)
					}
					cb();
				});
				
			},function(e,r){
				if(e) return callback(e);
				callback();
			});
		},function(error,rs){
			fn(error);
		});
	}else{
		fn();
	}
}
controller.prototype.delete =function(){
	var model = this.model;
	var ctrl = this;
	var name = this.name;
	var module = this.module;
	this.router.route(this.route_name + "/:id").delete(
		function(req,res,next){
			model.findOne({_id:req.params.id},function(error,obj){
				if(error) return res.status(400).send(error);
				if(!obj) return res.status(404).send("Lỗi: Không thể tìm thấy đối tượng này");
				if(underscore.has(model.schema.paths,"id_app")==true && obj.id_app !=req.user.current_id_app){
					return res.status(403).send("Lỗi: Không có quyền xóa đối tượng này");
				}
				permission.hasRight(obj.id_app,req.user.email,module,"delete",function(error,permission){
					if(!permission){
						return res.status(403).send("Bạn không có quyền xóa đối tượng này");
					}else{
						//check referenceKeys
						checkReference(model,obj,function(error){
							if(error) {
								error ="Lỗi: Không thể xóa do:\n" + error;
								return res.status(400).send(error)
							}
							req.obj = obj;
							next();
						});
					}
				});
				
			});
		},
		function(req,res,next){
			obj = req.obj;
			if(ctrl.deleting){
				ctrl.deleting(req.user,obj,function(error,obj){
					if(error){
						return res.status(400).send(error);
					}
					req.obj = obj;
					next();
				});
			}else{
				req.obj = obj;
				next();
			}
		},
		function(req,res,next){
			obj = req.obj;
			ctrl.emit("deleting",obj);
			model.findByIdAndRemove(obj._id,function(error,obj){
				if(error) return res.status(400).send(error);
				//log
				log.create({id_app:req.user.current_id_app,id_func:ctrl.name,action:'DELETE',data:obj},req.user.email,req.header('user-agent'),req)
				//
				ctrl.emit("deleted",obj);
				if(ctrl.deleted){
					ctrl.deleted(req.user,obj,function(error,obj){
						if(error){
							return res.status(400).send(error);
						}
						res.send(obj);
					});
				}else{
					res.send(obj);
				}
			});
		}
	);
}
controller.prototype.route = function(setRoute){
	if(setRoute){
		setRoute();
	}else{
		this.find();
		this.get();
		this.create();
		this.update();
		this.delete();
		this.getSocai();
		this.getVsocai();
		this.getNextId();
		this.exportToExcel();
		this.importFromExcel();
	}
}
module.exports = controller;