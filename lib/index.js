'use strict';

var JSONStream = require('JSONStream')
	,	map = require('map-stream')
	,	util = require('util')
	,	request = require('request')
	,	Transform = require('stream').Transform
	,	url = require('url');

function Validate (opts) {
	if (!(this instanceof Validate))
		return new Validate(opts);

	Transform.call(this, opts);
}

util.inherits(Validate, Transform);

Validate.prototype._transform = function (c, e, cb) {
	try {
		JSON.parse(c.toString('utf8'));
		this.push(c);
	} catch (er) {
		return cb(er);
	}

	return cb();
};

exports.search = function(pkg) {
	if (!pkg)
    throw new Error('A package name must be specified');

	var url = 'http://bower.herokuapp.com/packages/' + pkg;

	return request.get({uri: url});
};

exports.resolve = function (str, cb) {
	var resolved = false;

	str
		.pipe(Validate())
		.on('error', function (err) { cb(err);})
		.pipe(JSONStream.parse(['url']))
		.pipe(map(function (data, callback) {
			if (resolved) return;

			var parsed = url.parse(data);

			if (parsed.host !== 'github.com')
				cb(new Error('Couldn\'t find the repository.'));

			resolved = true;

			cb(null, 'https://' + (parsed.host + parsed.path).replace(/\.git$/,''));
		}));
}
