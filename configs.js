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
exports.domain = "domain.vn"
exports.company ="Sao Tiên Phong"
exports.program ="Open Accounting"
exports.version ="0.0.1 beta"
//emai sender
var wellknown = require('nodemailer-wellknown');
var sender = wellknown('Gmail');
sender.auth = {
		user: 'email',
		pass: 'password'
	}
sender.name ="Open Accounting";
exports.sender = sender;
//user admin
exports.admins =['invncur@gmail.com','hoangminhthanh@saotienphong.com.vn']
//oauth2.0
exports.google = {
		clientID: "cliendID",
		clientSecret: "clientSecret",
		callbackURL: "http://domain.vn/auth/google/callback",
		scope: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']
	}
exports.facebook = {
	clientID: "clientID",
	clientSecret: "clientSecret",
	callbackURL: "http://domain.vn/auth/facebook/callback",
	scope: ['email']
}
//
exports.database = {
	url:"mongodb://localhost/acc_v1"
}
