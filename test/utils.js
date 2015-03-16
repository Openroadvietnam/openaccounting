var utils = require('../libs/utils');

describe('numberToWord', function() {
	describe('breakDownNumber', function() {
		it('should split numbers by groups of 3 digits', function() {
			utils._private.breakDownNumber(1234).should.be.eql([
				{hundred:0, ten: 0, digit: 1},
				{hundred:2, ten: 3, digit: 4}
			]);
		});
	});

	describe('convertGroup', function() {
		it('should preserve leading zeros when asked', function() {
			utils._private.convertGroup(
				{hundred: 0, ten: 0, digit: 5}
			).should.be.exactly('năm');

			utils._private.convertGroup(
				{hundred: 0, ten: 0, digit: 5}, true
			).should.be.exactly('không trăm linh năm');

			utils._private.convertGroup(
				{hundred: 0, ten: 0, digit: 0}, true
			).should.be.exactly('');

			utils._private.convertGroup(
				{hundred: 0, ten: 0, digit: 0}, false
			).should.be.exactly('không');
		});

		it('should remove trailing zeros', function() {
			utils._private.convertGroup(
				{hundred: 1, ten: 5, digit: 0}
			).should.be.exactly('một trăm năm mươi');

			utils._private.convertGroup(
				{hundred: 1, ten: 0, digit: 0}
			).should.be.exactly('một trăm');
		});
	});

	it('should convert single digits', function() {
		utils.numberToWord(0).should.be.exactly('không');
		utils.numberToWord(1).should.be.exactly('một');
		utils.numberToWord(2).should.be.exactly('hai');
		utils.numberToWord(3).should.be.exactly('ba');
		utils.numberToWord(4).should.be.exactly('bốn');
		utils.numberToWord(5).should.be.exactly('năm');
		utils.numberToWord(6).should.be.exactly('sáu');
		utils.numberToWord(7).should.be.exactly('bảy');
		utils.numberToWord(8).should.be.exactly('tám');
		utils.numberToWord(9).should.be.exactly('chín');
	});

	it('should convert tens', function() {
		utils.numberToWord(10).should.be.exactly('mười');
		utils.numberToWord(20).should.be.exactly('hai mươi');
		utils.numberToWord(30).should.be.exactly('ba mươi');
		utils.numberToWord(40).should.be.exactly('bốn mươi');
		utils.numberToWord(50).should.be.exactly('năm mươi');
		utils.numberToWord(60).should.be.exactly('sáu mươi');
		utils.numberToWord(70).should.be.exactly('bảy mươi');
		utils.numberToWord(80).should.be.exactly('tám mươi');
		utils.numberToWord(90).should.be.exactly('chín mươi');
	});

	it('should convert tens and digits', function() {
		utils.numberToWord(11).should.be.exactly('mười một');
		utils.numberToWord(26).should.be.exactly('hai mươi sáu');
		utils.numberToWord(39).should.be.exactly('ba mươi chín');
	});

	it('should handle 21, 31, 41, etc.', function() {
		utils.numberToWord(21).should.be.exactly('hai mươi mốt');
		utils.numberToWord(31).should.be.exactly('ba mươi mốt');
		utils.numberToWord(41).should.be.exactly('bốn mươi mốt');
		utils.numberToWord(51).should.be.exactly('năm mươi mốt');
		utils.numberToWord(61).should.be.exactly('sáu mươi mốt');
		utils.numberToWord(71).should.be.exactly('bảy mươi mốt');
		utils.numberToWord(81).should.be.exactly('tám mươi mốt');
		utils.numberToWord(91).should.be.exactly('chín mươi mốt');
	});

	it('should handle 24, 34, 44, etc.', function() {
		utils.numberToWord(24).should.be.exactly('hai mươi tư');
		utils.numberToWord(34).should.be.exactly('ba mươi tư');
		utils.numberToWord(44).should.be.exactly('bốn mươi tư');
		utils.numberToWord(54).should.be.exactly('năm mươi tư');
		utils.numberToWord(64).should.be.exactly('sáu mươi tư');
		utils.numberToWord(74).should.be.exactly('bảy mươi tư');
		utils.numberToWord(84).should.be.exactly('tám mươi tư');
		utils.numberToWord(94).should.be.exactly('chín mươi tư');
	});

	it('should handle 25, 35, 45, etc.', function() {
		utils.numberToWord(25).should.be.exactly('hai mươi lăm');
		utils.numberToWord(35).should.be.exactly('ba mươi lăm');
		utils.numberToWord(45).should.be.exactly('bốn mươi lăm');
		utils.numberToWord(55).should.be.exactly('năm mươi lăm');
		utils.numberToWord(65).should.be.exactly('sáu mươi lăm');
		utils.numberToWord(75).should.be.exactly('bảy mươi lăm');
		utils.numberToWord(85).should.be.exactly('tám mươi lăm');
		utils.numberToWord(95).should.be.exactly('chín mươi lăm');
	});

	it('should convert hundreds', function() {
		utils.numberToWord(100).should.be.exactly('một trăm');
		utils.numberToWord(200).should.be.exactly('hai trăm');
		utils.numberToWord(300).should.be.exactly('ba trăm');
		utils.numberToWord(400).should.be.exactly('bốn trăm');
		utils.numberToWord(500).should.be.exactly('năm trăm');
		utils.numberToWord(600).should.be.exactly('sáu trăm');
		utils.numberToWord(700).should.be.exactly('bảy trăm');
		utils.numberToWord(800).should.be.exactly('tám trăm');
		utils.numberToWord(900).should.be.exactly('chín trăm');

		utils.numberToWord(909).should.be.exactly('chín trăm linh chín');
		utils.numberToWord(990).should.be.exactly('chín trăm chín mươi');
		utils.numberToWord(999).should.be.exactly('chín trăm chín mươi chín');
	});

	it('should convert numbers that span more than 3 digits', function() {
		utils.numberToWord(1005).should.be.exactly('một ngàn không trăm linh năm');
		utils.numberToWord(872438717633)
			.should.be.exactly(
				'tám trăm bảy mươi hai tỉ bốn trăm ba mươi tám triệu bảy trăm mười bảy ngàn sáu trăm ba mươi ba');
		utils.numberToWord(5690872438717633)
			.should.be.exactly(
				'năm triệu sáu trăm chín mươi ngàn tám trăm bảy mươi hai tỉ bốn trăm ba mươi tám triệu bảy trăm mười bảy ngàn sáu trăm ba mươi ba');

		// Number.MAX_SAFE_INTEGER
		utils.numberToWord(9007199254740991)
			.should.be.exactly(
				'chín triệu không trăm linh bảy ngàn một trăm chín mươi chín tỉ hai trăm năm mươi tư triệu bảy trăm bốn mươi ngàn chín trăm chín mươi mốt');
	});

	it('should skip trailing zeros', function() {
		utils.numberToWord(1000)
			.should.be.exactly('một ngàn');
		utils.numberToWord(1100)
			.should.be.exactly('một ngàn một trăm');
		utils.numberToWord(1110)
			.should.be.exactly('một ngàn một trăm mười');
		utils.numberToWord(1000000)
			.should.be.exactly('một triệu');
		utils.numberToWord(1500000)
			.should.be.exactly('một triệu năm trăm ngàn');
		utils.numberToWord(10000000)
			.should.be.exactly('mười triệu');
		utils.numberToWord(100000000)
			.should.be.exactly('một trăm triệu');
		utils.numberToWord(1000000000)
			.should.be.exactly('một tỉ');
		utils.numberToWord(1000000000000)
			.should.be.exactly('một ngàn tỉ');
		utils.numberToWord(1000000000000000)
			.should.be.exactly('một triệu tỉ');
		utils.numberToWord(100000000000000000)
			.should.be.exactly('một trăm triệu tỉ');
		utils.numberToWord(1000000000000000000)
			.should.be.exactly('một tỉ tỉ');
		utils.numberToWord(1200000000000000000)
			.should.be.exactly('một tỉ hai trăm triệu tỉ');
	});

	it('should convert negative numbers', function() {
		utils.numberToWord(-1).should.be.exactly('âm một');
		utils.numberToWord(-26).should.be.exactly('âm hai mươi sáu');
		utils.numberToWord(-39).should.be.exactly('âm ba mươi chín');
	});

	it('should allow regional variations', function() {
		utils.numberToWord(1000, {thousand: "nghìn"}).should.be.exactly("một nghìn");
		utils.numberToWord(0.1, {decimal: "phảy"}).should.be.exactly("không phảy một");
	});

	it('should convert decimal numbers', function() {
		utils.numberToWord(0.1).should.be.exactly("không phẩy một");
		utils.numberToWord(0.01).should.be.exactly("không phẩy không một");
		utils.numberToWord(0.12).should.be.exactly("không phẩy mười hai");
		utils.numberToWord(0.2).should.be.exactly("không phẩy hai");
		utils.numberToWord(0.21).should.be.exactly("không phẩy hai mươi mốt");
		utils.numberToWord(0.99).should.be.exactly("không phẩy chín mươi chín");
	});

	it('should only preserve 2 significant digits after the decimal separator', function() {
		utils.numberToWord(0.001).should.be.exactly("không");
		utils.numberToWord(0.999).should.be.exactly("một");
	});
});
