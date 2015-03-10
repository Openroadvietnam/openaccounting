var should = require("should");
require("../libs/array-funcs");

describe('Array', function() {
	describe('#csum', function() {
		it('Should return 0 on empty array', function() {
			var data = [];
			data.csum('value').should.be.exactly(0);
		});

		it('Should return a sum of all requested fields', function() {
			var data = [
				{'value': 1},
				{'value': 2},
				{'value': 3},
			];

			data.csum('value').should.be.exactly(6);
		});

		it('Should sum strings', function() {
			var data = [
				{'value': '1'},
				{'value': '2'},
				{'value': '3'},
			];

			data.csum('value').should.be.exactly(6);
		});

		it('Should only sum rows matching condition', function() {
			var data = [
				{'value': '1', due: true},
				{'value': '2'},
				{'value': '3'},
			];

			data.csum('value', {due: true}).should.be.exactly(1);
		});

		it('Should work with empty condition', function() {
			var data = [
				{'value': '1', due: true},
				{'value': '2'},
				{'value': '3'},
			];

			data.csum('value', {}).should.be.exactly(6);
		});

		it('Should skip missing values', function() {
			var data = [
				{'value': '1'},
				{'nope': '2'},
				{'value': '3'},
			];

			data.csum('value').should.be.exactly(4);
		});
	});
});
