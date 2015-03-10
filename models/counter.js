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
var counterScheam = new Schema({
	id_app:{type:String,required:true},
	name:{type:String,required:true},
	field:{type:String,required:true},
	sequence:{type:Number}
	
});
counterScheam.index({id_app:1,name:1});
var model= mongoose.model("counter",counterScheam);
model.getNextSequence = function(id_app,name,field,fn){
	model.findOneAndUpdate({id_app:id_app,name:name,field:field},{$inc: { sequence: 1 }},{new:true,upsert: true},function(error,obj){
		if(error) return fn(error);
		if(!obj){
			return fn(null,-1);
		}
		return fn(null,obj.sequence);
	});
}
module.exports = model