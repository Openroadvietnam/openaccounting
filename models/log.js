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
var logSchema = new Schema({
	id_app:{type:String},
	id_func:{type:String},
	action:{type:String},
	description:{type:String},
	data:{},
	ip:{type:String},
	user_agent:{type:String},
	status:{type:Boolean,default:true},
	date_created:{type:Date,default:Date.now},
	date_updated:{type:Date,default:Date.now},
	user_created:{type:String,default:''},
	user_updated:{type:String,default:''}
});
logSchema.index({id_app:1,id_func:1,action:1});
var Log = mongoose.model("log",logSchema);
Log.create = function(log,user_created,user_agent,req){
	var l = new Log();
	l.id_app = log.id_app;
	l.id_func = log.id_func;
	l.action = log.action;
	l.description = log.description;
	l.data = log.data;
	l.user_agent = user_agent
	l.user_created = user_created;
	if(req){
		l.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	}
	l.save(function(error){
		if(error) console.log("Can't create log\n" + error)
	})	
}
module.exports = Log