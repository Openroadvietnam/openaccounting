exports.domain = "domain.vn"
exports.company ="Sao Tiên Phong"
exports.program ="Open Accounting"
exports.version ="0.0.1 beta"
//emai sender
var wellknown = require('nodemailer-wellknown');
var sender = wellknown('Zoho');
sender.auth = {
        user: 'email',
        pass: 'password'
    }
sender.name ="Open Accounting";
exports.sender = sender;
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