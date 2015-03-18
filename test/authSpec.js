var assert = require('assert');
var sut = require("../app/conf/auth");

describe('Auth', function(){
	it('security.apiKey is defined', function(){
		assert.equal(false, sut.security.apiKey == undefined);
		assert.equal(false, sut.security.apiKey == null);
	});
	it('security.apiKey has value', function(){
		assert.equal(false, sut.security.apiKey == '');
	});
});