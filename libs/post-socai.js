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
var Vsocai = require("../models/vsocai");
var Socai = require("../models/socai");
var underscore = require("underscore");
var post = function(master,details,prepare){
	if(!details){
		return;
	}
	this.master = master.toObject();
	if(underscore.isObject(details)){
		this.details=details;
	}else{
		this.details=details.toObject();
	}
	this.prepare = prepare;
	if(!this.prepare){
		this.prepare = function(detail,callback){
			callback(detail);
		}
	}
	
}
post.prototype.run = function(callback){
	if(!this.details){
		return;
	}
	var master = this.master;
	var details = this.details;
	var eventEmitter = this;
	var prepare = this.prepare;
	if(!master["ngay_ct"]){
		return console.error("ngay_ct is not null");
	}
	//post
	console.log("posting socai ma_ct:" + master.ma_ct + ", so_ct:" + master.so_ct);
	Vsocai.remove({id_ct:master._id},function(error){
		if(error) return console.error("Don't remove vsocai \n" +error);
		Socai.remove({id_ct:master._id},function(error){
			if(error) return console.error("Don't remove socai \n" +error);
			var i=0;
			details.forEach(function(detail){
				prepare(detail,function(detail){
					if(!detail.tk_no || !detail.tk_co || detail.tk_no=="" || detail.tk_co==""){
						return;
					}
					if(!detail.tien_nt) detail.tien_nt =0;
					if(!detail.tien) detail.tien =0;
					if(master.ma_nt=='VND'){
						detail.tien = detail.tien_nt;
					}
					if(detail.tien_nt==0 && detail.tien==0){
						return;
					}
					i++;
					//post socai
					var sc = new Socai();
					sc.set('id_ct',master._id);
					if(!detail.ma_kh_no) detail.ma_kh_no = detail.ma_kh
					if(!detail.ma_kh_co) detail.ma_kh_co = detail.ma_kh
					//set other attributes for socai
					for(var attr in Socai.schema.paths){
						if(attr!="id_ct" && attr!="_id"){
							v = detail[attr];
							if(v){
								sc.set(attr,v);
							}else{
								v = master[attr];
								if(v){
									sc.set(attr,v);
								}
							}
						}
						
					}
					//create
					sc.save(function(error,result){
						if(error){
							console.error("Can't post socai \n" + error);
							return;
						}
						var detailSc = result.toObject();
						//post vsocai
						var no = new Vsocai();
						var co = new Vsocai();
						//prepare data
						no.set('id_ct',master._id);
						co.set('id_ct',master._id);
						no.set("_nh_dk",i);
						co.set("_nh_dk",i);
						//set tk
						v = detailSc["tk_no"];
						if(v){
							no.set('tk',v);
							co.set('tk_du',v);
						}
						v = detailSc["tk_co"];
						if(v){
							no.set('tk_du',v);
							co.set('tk',v);
						}
						//set ps no, ps co
						v = detailSc["tien"];
						if(v){
							no.set('ps_no',v);
							co.set('ps_co',v);
						}
						v = detailSc["tien_nt"];
						if(v){
							no.set('ps_no_nt',v);
							co.set('ps_co_nt',v);
						}
						//set ma_kh no
						v = detailSc["ma_kh_no"];
						if(v){
							no.set('ma_kh',v);
						}
						//set ma_kh co
						v = detailSc["ma_kh_co"];
						if(v){
							co.set('ma_kh',v);
						}
						//set other attributes for vsocai
						for(var attr in Vsocai.schema.paths){
							if(attr!="id_ct" && attr!="_id"){
								v = detailSc[attr];
								if(v){
									no.set(attr,v);
									co.set(attr,v);
								}else{
									v = master[attr];
									if(v){
										no.set(attr,v);
										co.set(attr,v);
									}
								}
							}
							
						}
						//create
						Vsocai.create([no,co],function(error,no1,co1){
							if(error) { 
								console.error("Can't post vsocai \n" + error);
								return;
							}
							if(callback){
								callback(no1,co1);
							}
						});
					});
					
					
				});
				
				
			});
		});
		
	});
}
module.exports = post;