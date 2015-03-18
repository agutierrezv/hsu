var assert = require('assert');
var conf = require("../app/conf/configuration");

describe('Configuration', function(){

	it('environment devel is defined', function(){
		var sut = conf.getConfiguration('devel');
		assert.equal('devel', sut.environment);
		assert.equal(true, sut.hostUrl != null);
		assert.equal(true, sut.queue.IRON_MQ_PROJECT_ID != null);
		assert.equal(true, sut.queue.IRON_MQ_TOKEN != null);
		assert.equal(true, sut.redis.REDISCLOUD_URL == null);
		

	});
	it('environment production is defined', function(){
		var sut = conf.getConfiguration('production');
		assert.equal('production', sut.environment);
		assert.equal(true, sut.hostUrl != null);
		assert.equal(true, sut.queue.IRON_MQ_PROJECT_ID != null);
		assert.equal(true, sut.queue.IRON_MQ_TOKEN != null);
		assert.equal(true, sut.redis.REDISCLOUD_URL != null);
	});

	it('default enviroment is devel', function(){
		var sut = conf.getConfiguration();
		assert.equal('devel', sut.environment);
	});


});