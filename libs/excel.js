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
var xlsx = require("node-xlsx")
var underscore = require("underscore")
exports.parse = function(filePath,callback){
	var obj  = xlsx.parse(filePath);
	if(obj.length==0 || obj[0].data.length==0) return callback("File excel không có dữ liệu");
	var data = obj[0].data
	//get column
	var columns ={}
	var d_columns = data[0]
	for(var i=0;i<d_columns.length;i++){
		var c_1 = d_columns[i].lastIndexOf("(");
		var c_2 = d_columns[i].lastIndexOf(")");
		if(c_1>0 && c_2 >0 && c_1 < c_2){
			var c = d_columns[i].substring(c_1+1,c_2);
			var h = d_columns[i].substring(0,c_1);
			columns[c] = h
		}else{
			return callback("File excel không hợp lệ");
		}
	}
	//get row
	var columns_name = underscore.keys(columns);
	var data_f = [];
	for(var i=1;i<data.length;i++){
		var d = {}
		var c_i = 0;
		for(var c_i=0;c_i<columns_name.length;c_i++){
			if(data[i].length > c_i){
				var c_n = columns_name[c_i]
				var v = data[i][c_i]
				d[c_n] = v
			}
		}
		data_f.push(d)
	}
	callback(null,data_f,columns);
}