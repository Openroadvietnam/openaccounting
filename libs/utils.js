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

var should = require("should");
var _ = require('underscore');


// Let's solve this by first breaking down the number into groups of
// three digits with unit
//
// 256      -> [(256, '')]
// 1024     -> [(001, 'ngan'), (024, '')]
// 16384    -> [(016, 'ngan'), (384, '')]
// 1750000  -> [(001, 'trieu'), (750, 'ngan'), (000, '')]
//
// Then the problem is reduced into converting a group of 3 digits
// into words.

function numberToWord(number, thousand) {
	var sign = '';
	if (number < 0) {
		sign = 'âm ';
		number = -number;
	}

	thousand = typeof thousand !== 'undefined' ? thousand : 'ngàn';

	// Break the number into groups of 3 digits
	var digitGroups = breakDownNumber(number).reverse();

	// Convert each group, add unit and sign
	return sign + _.chain(digitGroups).map(function(group, index) {
		var preserveZeros = index === digitGroups.length - 1 ? false : true;
		var convertedGroup = convertGroup(group, preserveZeros);

		var unit = unitAt(index, thousand);

		// If the group consists of only zeros then don't add a unit
		// unless the group is a 'tỉ'
		if (!convertedGroup && index % 3 !== 0) {
			unit = '';
		}

		if (convertedGroup && unit) {
			unit = ' ' + unit;
		}

		return convertedGroup + unit;
	}).compact().reverse().join(' ');
}


function unitAt(index, thousand) {
	if (index === 0)
		return '';

	switch (index % 3) {
	case 0:
		return 'tỉ';
	case 1:
		return thousand;
	case 2:
		return 'triệu';
	}
}


function convertGroup(group, preserveZeros) {
	var DIGITS = ['không',
				  'một', 'hai', 'ba',
				  'bốn', 'năm', 'sáu',
				  'bảy', 'tám', 'chín'];

	var DIGITS_WITH_TENS = ['',
							'mốt', 'hai', 'ba',
							'tư', 'lăm', 'sáu',
							'bảy', 'tám', 'chín'];

	var TENS = ['linh',
				'mười', 'hai mươi', 'ba mươi',
				'bốn mươi', 'năm mươi', 'sáu mươi',
				'bảy mươi', 'tám mươi', 'chín mươi'];

	var HUNDREDS = _.map(DIGITS, function(digit) {
		return digit + ' trăm';
	});

	var hundred = '';
	var ten = '';
	var digit = '';

	if (preserveZeros && !group.hundred && !group.ten && !group.digit) {
		return '';
	}

	if (preserveZeros || group.hundred) {
		hundred = HUNDREDS[group.hundred];
	}

	if (preserveZeros || group.ten || group.hundred) {
		if (group.ten || group.digit) {
			ten = TENS[group.ten];
		}

		if ((group.ten === 1 || !group.ten) && group.digit) {
			// mười một
			digit = DIGITS[group.digit];
		} else {
			// hai mươi mốt
			digit = DIGITS_WITH_TENS[group.digit];
		}
	} else {
		digit = DIGITS[group.digit];
	}

	if (hundred && ten) {
		hundred += ' ';
	}

	if (ten && digit) {
		ten += ' ';
	}

	return [hundred, ten, digit].join('');
}


function breakDownNumber(number) {
	var digits = number.toString().split('');
	var paddings = _.map(_.range(0, (3 - digits.length % 3) % 3),
						 function() {return 0;});
	digits = paddings.concat(digits);

	return _.chain(digits)
		.map(Number)
		.groupBy(function(element, index) { return Math.floor(index / 3); })
		.toArray()
		.map(function(group) { return _.object(['hundred', 'ten', 'digit'], group); })
		.value();
}


module.exports = {
	numberToWord: numberToWord
};


if (process.env.NODE_ENV === 'test') {
	module.exports._private = {
		breakDownNumber: breakDownNumber,
		convertGroup: convertGroup
	};
}
