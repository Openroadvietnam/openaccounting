var fs = require("fs");
var underscore = require("underscore");
var configs = require("../configs");
module.exports = function(template,data,callback){
	template = "./templates/" + template;
	fs.readFile(template,function(error,html){
		if(error) return callback(error);
		
		html = html.toString();
		html = html.replace(new RegExp("{{domain}}", 'g'),configs.domain);
		html = html.replace(new RegExp("{{program}}", 'g'),configs.program);
		html = html.replace(new RegExp("{{company}}", 'g'),configs.company);
		
		for(var key in data){
			var da = data[key];
			if(underscore.isObject(da)){
				for(var k in da){
					var d = da[k]
					if(d){
						if(underscore.isDate(d)){
							d = d.getDate().toString() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear().toString() + " " + d.getHours().toString() + " giờ " + d.getMinutes().toString() + " phút" 
						}
						html = html.replace(new RegExp("{{" + key + "."  + k + "}}", 'g'),d.toString());
					}else{
						html = html.replace(new RegExp("{{" + key + "." + k + "}}", 'g'),"");
					}
				}
			}else{
				
				if(da){
					if(underscore.isDate(da)){
						da = da.getDate().toString() + "/" + (da.getMonth() + 1) + "/" + da.getFullYear().toString() + " " + da.getHours().toString() + " giờ " + da.getMinutes().toString() + " phút" 
					}
					html = html.replace(new RegExp("{{" + key + "}}", 'g'),da.toString());
				}else{
					html = html.replace(new RegExp("{{" + key + "}}", 'g'),"");
				}
				
			}
		}
		callback(null,html);
	});
}