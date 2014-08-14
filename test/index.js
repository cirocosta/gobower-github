'use strict';

var assert = require('assert')
	,	sinon = require('sinon')
	,	request = require('request')
	,	fs = require('fs')
	,	gonpmGithub = require('../lib/index');


describe('gonpmGithub', function() {
	it('should be sane', function() {
		assert(!!gonpmGithub);
	});

	describe('search', function() {
		beforeEach(function (done) {
			(sinon.stub(request, 'get'), done());
		});

		afterEach(function (done) {
			(request.get.restore(), done());
		});

		it('should throw if no param', function() {
			var throwFn = function () {
				gonpmGithub.search();
			};

			assert.throws(throwFn);
		});

		it('should use the correct url', function() {
			gonpmGithub.search('jquery');

			var expected = 'http://bower.herokuapp.com/packages/jquery';
			var actual = request.get.getCall(0).args[0].uri;

			assert.equal(actual, expected);
		});
	});

	describe('resolve', function() {
		it('should find the repository', function(done) {
			var file = fs.createReadStream(__dirname + '/sample.json');
			var expected = 'https://github.com/jquery/jquery';

			gonpmGithub.resolve(file, function (err, url) {
				if (err) done(err);

				assert.equal(url, expected);
				done();
			});
		});

		it('should fail gracefully', function(done) {
			var file = fs.createReadStream(__dirname + '/wrong-sample.txt');
			var expected = 'https://github.com/jquery/jquery';

			gonpmGithub.resolve(file, function (err, url) {
				assert(err);
				done();
			});
		});
	});
});
