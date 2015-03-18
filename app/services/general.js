function apply(app, models) {

	//Add extra functionality
	app.post('/api/delete', function(req, res) {
		var className = req.body.className;
		var ids = req.body.ids;
		//console.log("Delete many for: " + className + ' ids: ' + ids);

		var model = models.getModelForClass(className);
		for(var index in ids) {
			var idItem = ids[index];

			model.findOneAndRemove( {'_id': idItem}, postDeleteItem);
		}    
		res.status(200)
			.set('Content-Type', 'text/json')
			.send('');
	});

	function postDeleteItem(err, ok) {
		if (err) {
			consoleError(err);
		}
		else {
			//console.log('Object: ' + className + ' id: ' + idItem + 'was deleted.');
		}
	}

	function consoleError(err){
		if (err) {
			console.error(err);
		}
	}

	app.post('/api/deleteAll', function(req, res) {
	  	try {
		    var className = req.body.className;
		    var model = models.getModelForClass(className);
		    console.log("DeleteAll: " + req.body.conditions);
		    var criteria = "";
		    if (req.body.conditions != null && req.body.conditions !== "") {
		      criteria = JSON.parse(req.body.conditions);
		      model.remove(criteria).exec();
		    } else {
		      //delete all
		      model.remove().exec();    
		    }
	        
		    res.status(200)
		       .set('Content-Type', 'text/json')
		       .send('{}');
	  	}
	  	catch (e) {
		    res.status(401)
		       .set('Content-Type', 'text/json')
		       .send('{ "error" : "Invalid query"}');
	  	}
	});

	//Error handler
	app.use(function(err, req, res, next) {
		console.error(req.query);
		console.error(err.stack);
	});

	//CORS enabled for allowing 3rd party web-apps to consume Swagger metadata and backend. 
	//Disable it commenting this block if you don not need it. ----------
	app.all('*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");  //Change * to your host domain
		res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
		res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE");
	    next();
	});

}
module.exports.apply = apply;