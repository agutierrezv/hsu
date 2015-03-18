var assert = require('assert');
var sut = require("../app/services/timeline");

describe('timeline Services', function(){

	
	it('sort collection IsoDate', function(){
		
		var data = [
			{"fecha": new Date("2014-12-15T15:10:41.587Z"),"name":"a"},
		 	{"fecha": new Date("2016-03-02T15:41:31.543Z"),"name":"b-max"},
		 	{"fecha": new Date("2015-02-02T15:46:04.069Z"),"name":"c"},
		 	{"fecha": new Date("2015-02-02T15:30:35.286Z"),"name":"d"},
		 	{"fecha": new Date("2015-03-02T15:31:10.431Z"),"name":"e"},
		 	{"fecha": new Date("2015-03-02T15:36:10.730Z"),"name":"f"},
		 	{"fecha": new Date("2013-01-02T15:34:49.753Z"),"name":"g-min"},
		 	{"fecha": new Date("2015-03-12T15:34:42.341Z"),"name":"h"}
		];

		var res = sut.sortTimeLine(data);

		//console.log(JSON.stringify(res, null, 2));

		assert.equal(8, res.length);
		assert.equal("b-max", res[0].name);
		assert.equal("g-min", res[7].name);
		assert.equal(true, sut.timeLineDescSorter(res[0], res[1]) < 0);
		assert.equal(true, sut.timeLineDescSorter(res[1], res[2]) < 0);
		assert.equal(true, sut.timeLineDescSorter(res[2], res[3]) < 0);
		assert.equal(true, sut.timeLineDescSorter(res[3], res[4]) < 0);
		assert.equal(true, sut.timeLineDescSorter(res[4], res[5]) < 0);
		assert.equal(true, sut.timeLineDescSorter(res[5], res[6]) < 0);
		assert.equal(true, sut.timeLineDescSorter(res[6], res[7]) < 0);
	});		

	it('sort collection RomanceDate', function(){
		
		var data = [
			{"fecha": new Date("Mon Mar 02 2015 16:30:35 GMT+0100 (Romance Standard Time)"),"name":"a"},
		 	{"fecha": new Date("Mon Dec 15 2014 16:10:39 GMT+0100 (Romance Standard Time)"),"name":"b"},
		 	{"fecha": new Date("Thu Jan 25 2016 11:35:39 GMT+0100 (Romance Standard Time)"),"name":"d"},
		 	{"fecha": new Date("Fri Mar 26 2016 11:35:39 GMT+0100 (Romance Standard Time)"),"name":"e"},
		 	{"fecha": new Date("Wen Feb 24 2016 11:35:39 GMT+0100 (Romance Standard Time)"),"name":"c"}
		];

		var res = sut.sortTimeLine(data);

		//console.log(JSON.stringify(res, null, 2));

		assert.equal(5, res.length);
		assert.equal("e", res[0].name);
		assert.equal("b", res[4].name);
		assert.equal(true, sut.timeLineDescSorter(res[0], res[1]) < 0);
		assert.equal(true, sut.timeLineDescSorter(res[1], res[2]) < 0);
		assert.equal(true, sut.timeLineDescSorter(res[2], res[3]) < 0);
		assert.equal(true, sut.timeLineDescSorter(res[3], res[4]) < 0);
	});		
	
});