var nodemailer = require("nodemailer")
var systemConfig = require("../configs");
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async')
var underscore = require('underscore')
exports.sendHtml = function(options,fn){
	var transporter = nodemailer.createTransport(smtpTransport(systemConfig.sender));
	var from ={name:systemConfig.sender.name,address:systemConfig.sender.auth.user};
	if(options.sender){
		from.name = options.sender;
	}
	if(underscore.isObject(options.to)){
		transporter.sendMail({
			from: from,
			to: options.to,
			subject: options.subject,
			html: options.html
		},function(error,info){
			fn(error,info);
		});
	}else{
		if(underscore.isArray(options.to)){
			async.map(options.to,function(to,callback){
				if(to.address){
					transporter.sendMail({
						from: from,
						to: to,
						subject: options.subject,
						html: options.html
					},function(error,info){
						callback(error,info);
					});
				}else{
					callback(null);
				}
			},function(error,t){
				fn(error,t);
			});
		}
	}
	
}