'use strict';

var JSONStream = require('JSONStream')
	,	map = require('map-stream')
	,	request = require('request')
	,	url = require('url');


exports.search = function(pkg) {
	if (!pkg) throw new Error('A package name must be specified');

	var url = 'http://bower.herokuapp.com/packages/' + pkg;

	return request.get({uri: url});
};

exports.resolve = function (str, cb) {
	var resolved = false;

	str
		.pipe(JSONStream.parse(['url']))
		.pipe(map(function (data, callback) {
			if (resolved) return;

			var parsed = url.parse(data);

			if (!parsed.host ==='github.com')
				cb(new Error('Couldn\'t find the repository.'));

			resolved = true;

			cb(null, 'https://' + (parsed.host + parsed.path).replace('.git',''));
		}));
}
