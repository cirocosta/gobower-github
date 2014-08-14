'use strict';

var assert = require('assert')
	,	sinon = require('sinon')
	,	request = require('request')
	,	fs = require('fs')
	,	gobowerGithub = require('../lib/index');


describe('gobowerGithub', function() {
	it('should be sane', function() {
		assert(!!gobowerGithub);
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
				gobowerGithub.search();
			};

			assert.throws(throwFn);
		});

		it('should use the correct url', function() {
			gobowerGithub.search('jquery');

			var expected = 'http://bower.herokuapp.com/packages/jquery';
			var actual = request.get.getCall(0).args[0].uri;

			assert.equal(actual, expected);
		});
	});

	describe('resolve', function() {
		it('should find the repository', function(done) {
			var file = fs.createReadStream(__dirname + '/sample.json');
			var expected = 'https://github.com/jquery/jquery';

			gobowerGithub.resolve(file, function (err, url) {
				if (err) done(err);

				assert.equal(url, expected);
				done();
			});
		});

		it('should fail gracefully', function(done) {
			var file = fs.createReadStream(__dirname + '/wrong-sample.txt');

			gobowerGithub.resolve(file, function (err, url) {
				assert(err);
				done();
			});
		});
	});
});
