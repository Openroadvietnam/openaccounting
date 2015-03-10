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