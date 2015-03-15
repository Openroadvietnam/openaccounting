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
var PostBook = require("../../libs/post-book");
var PostSocai = require("../../libs/post-socai");
var arrayfuncs = require("../../libs/array-funcs");
var Vatvao = require("../../models/vatvao");
var Vatra = require("../../models/vatra");
var Vsocai = require("../../models/vsocai");
var socai = require("../../models/socai");
var Tdttno_tt = require("../../models/tdttno_tt");
var Tdttno = require("../../models/tdttno");
var dvcs = require("../../models/dvcs");
var account = require("../../models/account");
var customer = require("../../models/customer");
var dmdt = require("../../models/dmdt");
var model = require("../../models/pt1");
var controller = require("../../controllers/controller");
var valid_acc_cust = require("../../libs/validator-acc-cust");
var async = require("async");
var ma_ct ='PT1';
var valid_detail = function(user,obj,fn){
	var id_app = obj.id_app;
	for(var i=0;i<obj.details.length;i++){
		detail = obj.details[i];
		detail.line = i;
		if(obj.ma_nt =='VND'){
			detail.tien=detail.tien_nt;
		}
	}
	if(obj.tdttnos){
		for(var i=0;i<obj.tdttnos.length;i++){
			tdttno = obj.tdttnos[i];
			tdttno.line = i;
			if(obj.ma_nt =='VND'){
				tdttno.tien=tdttno.tien_nt;
			}
		}
	}
	fn(null,obj);
}
module.exports = function(router){
	this.contr = new controller(router,model,ma_ct.toLowerCase(),{
		sort:		{ngay_ct:-1,so_ct:1}
	});
	this.contr.route();
	//post data
	this.contr.post = function(obj){
		//post tdttno
		var posttdttno = new PostBook(obj,obj.tdttnos,Tdttno_tt,function(tdttno,callback){
			tdttno.tk_no = obj.tk_no;
			callback(tdttno);
		});
		posttdttno.run(function(detail){
			if(detail.con_lai_nt<=detail.thanh_toan_qd){
				Tdttno.findOneAndUpdate({_id:detail.id_hd},{$set:{tat_toan:true}},function(error,result){
					if(error) return console.log(error)
					if(result){
						console.log("Hoa don " + detail.so_hd  + " da duoc tat toan");
					}
				});
			}
		});
		//post socai
		var details_sc =[];
		//detail
		obj.details.forEach(function(d){
			var detail = d.toObject();
			detail.tk_no = obj.tk_no;
			if(!detail.ma_kh){
				detail.ma_kh = obj.ma_kh;
			}
			details_sc.push(detail);
		});
		//post socai cttdttno
		obj.tdttnos.forEach(function(t){
			var tdttno = t.toObject();
			tdttno.tk_no = obj.tk_no;
			if(!tdttno.ma_kh){
				tdttno.ma_kh = obj.ma_kh;
			}
			details_sc.push(tdttno);
		});
		
		var postsocai = new PostSocai(obj,details_sc)
		postsocai.run();
		
	}
	//deleted 
	this.contr.deleted = function(user,obj,callback){
		id_app = user.current_id_app;
		//delete vsocai
		Vsocai.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted socai of voucher " + obj.so_ct);
		});
		//delete socai
		socai.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted socai of voucher " + obj.so_ct);
		});
		//delete tdttno_tt
		Tdttno_tt.remove({id_ct:obj._id},function(error){
			if(error) return console.error(error);
			console.log("deleted tdttno of voucher " + obj.so_ct);
		});
		//neu da tat toan thi xoa tat toan
		for(var i=0;i<obj.tdttnos.length;i++){
			var detail = obj.tdttnos[i];
			Tdttno.findOneAndUpdate({_id:detail.id_hd,so_hd:detail.so_hd},{$set:{tat_toan:false}},function(error,result){
				if(error) return console.log(error)
				if(result){
					console.log("Hoa don " + detail.so_hd  + " da duoc bo tat toan");
				}
			});
		}
		callback(null,obj);
	}
	this.contr.creating= function(user,obj,next){
			id_app = user.current_id_app;
			//valid
			valid_detail(user,obj,function(error){
				if(error) return next(error);
				next(null,obj); 
			});
			
		}
	this.contr.updating = function(user,data,obj,next){ 
		id_app = user.current_id_app;
		//valid
		valid_detail(user,data,function(error){
			if(error) return next(error);
			next(null,data,obj); 
		});
	}
	this.contr.view = function(user,items,fn){
		id_app = user.current_id_app;
		async.parallel({
			kh:function(callback){
				items.joinModel(id_app,customer,[{akey:'ma_kh',bkey:'ma_kh',fields:[{name:'ten_kh',value:'ten_kh'}]}],function(kq){
					callback();
				});
			},
			tk:function(callback){
				items.joinModel(id_app,account,[{akey:'tk_no',bkey:'tk',fields:[{name:'ten_tk_no',value:'ten_tk'}]}],function(kq){
					callback();
				});
			},
			dv:function(callback){
				items.joinModel(id_app,dvcs,[{akey:'ma_dvcs',bkey:'_id',fields:[{name:'ten_dvcs',value:'ten_dvcs'}]}],function(kq){
					callback();
				});
			},
			t_tien:function(callback){
				items.forEach(function(r){
					r.t_tien = 0;
					r.t_tien_nt = 0;
					if(r.details){
						
						r.t_tien = r.details.csum('tien');
						r.t_tien_nt = r.details.csum('tien_nt');
						
					}
					if(r.tdttnos){
						
						r.t_tien = r.t_tien + r.tdttnos.csum('tien');
						r.t_tien_nt = r.t_tien_nt + r.tdttnos.csum('tien_nt');
						
					}
				});
				
				
				callback();
			},
			details_tk:function(callback){
				async.map(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,account,[{akey:'tk_co',bkey:'tk',fields:[{name:'ten_tk_co',value:'ten_tk'}]}
															],function(kq){
							callback1();
						});
					},
					function(error){
						
						callback();
					}
				);
			},
			details_customer:function(callback){
				async.map(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,customer,[{akey:'ma_kh',bkey:'ma_kh',fields:[{name:'ten_kh',value:'ten_kh'}]}
															],function(kq){
							callback1();
						});
					},
					function(error){
						
						callback();
					}
				);
			},
			details_dt:function(callback){
				async.map(
					items,
					function(r,callback1){
						var details = r.details;
						details.joinModel(id_app,dmdt,[{akey:'ma_dt',bkey:'ma_dt',fields:[{name:'ten_dt',value:'ten_dt'}]}
															],function(kq){
							callback1();
						});
					},
					function(error){
						
						callback();
					}
				);
			}
		},function(error,results){
			
			fn(null,items);
		});
	}
}