//Optimize Count middleware ------

function optimizeCount(req, res, next) {
	if (queryIsTotalCount(req)) {
		return directCount(req, res);
	}
	next();
}
function queryIsTotalCount(req) {
	if (req.url === '/?count=true') {
		return true;
	}
	return false;
}
function isEmptyObject(obj) {
	for ( var prop in obj ) {
		return false;
	}
	return true;
}
//Direct count bypassing baucis & mongoose
function directCount(req, res) {
	var count = doNativeCount(req.baucis.controller, function(err, count) {

		if (err) {
			res.status(500).json(err);
		}
		else {
			res.status(200).json(count);
		}
	});
}
//Native mongoDB count() bypassing baucis and mongoose 
function doNativeCount(controller, callbackCount) {
	var col = controller.model().collection;
	col.count({}, function(err, count) {
		callbackCount(err, count);
	});
}

function apply(controllers) {

	controllers.forEach(function(ctl) {
		//optimize count
		ctl.request('get', optimizeCount);
	});
}

module.exports.apply = apply;