var Vsocai = require("../models/vsocai");
module.exports = function(query,fn){
	var o ={};
	o.map = function(){
		var key = this.tk;
		
		var value = {ps_no:this.ps_no,ps_no_nt:this.ps_no_nt,ps_co:this.ps_co,ps_co_nt:this.ps_co_nt};
		emit(key,value);
	}
	o.reduce = function(key,values){
		reduceValues = {};
		reduceValues.ps_no = 0;
		reduceValues.ps_co = 0;
		reduceValues.ps_no_nt = 0;
		reduceValues.ps_co_nt = 0;
		values.forEach(function(value){
			reduceValues.ps_no +=value.ps_no;
			reduceValues.ps_no_nt +=value.ps_no_nt;
			reduceValues.ps_co +=value.ps_co;
			reduceValues.ps_co_nt +=value.ps_co_nt;
			
		});
		return reduceValues;
	}
	o.query = query;
	Vsocai.mapReduce(o,function(error,results){
		if(error) {
			fn(error);
			return;
		}
		var kqs = [];
		results.forEach(function(result){
			var kq = {};
			kq.tk = result._id;
			kq.ps_no = result.value.ps_no;
			kq.ps_co = result.value.ps_co;
			kq.ps_no_nt = result.value.ps_no_nt;
			kq.ps_co_nt = result.value.ps_co_nt;
			
			kqs.push(kq);
		});
		fn(null,kqs);
	});
}