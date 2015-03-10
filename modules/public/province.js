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
var underscore = require("underscore")
module.exports = function(router){
	router.route("/province").get(
		function(req,res,next){
			var tt =['An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu',
				'Bắc Ninh','Bến Tre','Bình Định','Bình Dương',
				'Bình Phước','Bình Thuận','Cà Mau','Cao Bằng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai',
				'Hà Giang','Hà Nam','Hà Tĩnh','Hải Dương',
				'Hậu Giang','Hòa Bình',
				'Hưng Yên','Khánh Hòa',
				'Kiên Giang','Kon Tum',
				'Lai Châu','Lâm Đồng',
				'Lạng Sơn','Lào Cai',
				'Long An','Nam Định',
				'Nghệ An','Ninh Bình',
				'Ninh Thuận','Phú Thọ',
				'Quảng Bình','Quảng Nam',
				'Quảng Ngãi','Quảng Ninh',
				'Quảng Trị','Sóc Trăng',
				'Sơn La','Tây Ninh',
				'Thái Bình',
				'Thái Nguyên',
				'Thanh Hóa',
				'Thừa Thiên Huế',
				'Tiền Giang',
				'Trà Vinh',
				'Tuyên Quang',
				'Vĩnh Long',
				'Vĩnh Phúc',
				'Yên Bái',
				'Phú Yên',
				'Cần Thơ',
				'Đà Nẵng',
				'Hải Phòng',
				'Hà Nội',
				'TP HCM'
			]
			tt = underscore.sortBy(tt,function(t){
				return t;
			});
			res.send(tt)
		}
	)
}
