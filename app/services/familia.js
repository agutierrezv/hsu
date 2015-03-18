//Familia Services -----------------------
function apply(models) {
	
	var familiaController = models.models.familia.controller;

	//Adds a family member in familia, ciudadano and miembro
	familiaController.post('/addMiembro', function(req, res, done) {
	   
	    var familiaModel = familiaController.model();
	    var miembroModel = models.models.miembro.controller.model();
	    var ciudadanoModel = models.models.ciudadano.controller.model();

	    //remove previous relations
	    miembroModel.remove({'ciudadano': req.body.ciudadanoId}).exec(function(err, data) {
	        if (err) {
	          return handleError(err, res, done);
	        }
	    });

	    ciudadanoModel.findOneAndUpdate(
	            {'_id': req.body.ciudadanoId},
	            { 'familia': req.body.familiaId },
	            function(err, data) {
	                if (err) {
	                  return handleError(err, res, done);
	                }
	    });


	    var newMiembro = new miembroModel({
	        'familia':   req.body.familiaId,
	        'ciudadano': req.body.ciudadanoId,
	        'parentesco':  req.body.parentesco,
	        'fechaAlta':   Date.now()
	    });

	    newMiembro.save(function(err, miembro) {
	        if (err) {
	          handleError(err, res, done);
	          return;
	        }
	        if (miembro) {
	            familiaModel.findOne({'_id': req.body.familiaId}).exec(function(err, familia) {
	                if (err) {
	                  handleError(err, res, done);
	                  return;
	                }
	                if (familia) {
	                    familia.miembros.push(miembro._id);
	                    familia.save();

	                    console.log("  Added member:" +miembro._id);

	                    returnJson(res, {'success': 'ok'});
	                }
	            });                    
	        }
	    });
	    
	});

	//Removes a family member in familia, ciudadano and miembro
	familiaController.post('/removeMiembro', function(req, res, done) {
	    var familiaModel = familiaController.model();
	    var miembroModel = models.models.miembro.controller.model();
	    var ciudadanoModel = models.models.ciudadano.controller.model();

	    ciudadanoModel.findOneAndUpdate(
	            {'_id': req.body.ciudadanoId},
	            { 'familia': null },
	            function(err, data) {
	                if (err) {
	                  return handleError(err, res, done);
	                }
	    });

	    miembroModel.findOne({
	        'familia'  : req.body.familiaId, 
	        'ciudadano': req.body.ciudadanoId  }).exec (function(err, miembro) {
	        if (err) {
	          handleError(err, res, done);
	          return;
	        }
	        if (miembro) {
	            miembro.remove();

	            familiaModel.findOne({"_id": req.body.familiaId}).exec (function(err, familia) {
	                if (err) {
	                    handleError(err, res, done);
	                    return;
	                }
	                if (familia) {
	                    familia.miembros = familia.miembros.filter(function(miembroItem) {
	                        if (miembroItem._id != miembro._id) {
	                            return miembroItem; 
	                        }
	                    });
	                    familia.save();
	                    console.log("  removeMiembro done: " + miembro._id); 

	                    returnJson(res, {'success': 'ok'});
	                }
	            });
	        }    
	    });
	});

	//Retrieves a family & members
	familiaController.get('/familiaMiembros/:id', function(req, res, done) {
	    var familiaId = req.params.id;
	    var familiaModel = familiaController.model();
	    var miembroModel = models.models.miembro.controller.model();

	    familiaModel.findOne({"_id": familiaId}).exec (function(err, familia) {
	        if (err) {
	            handleError(err, res, done);
	            return;
	        }
	        if (familia) {
	            miembroModel.find({'familia'  : familiaId })
	                        .populate('ciudadano')
	                        .sort('fechaAlta')
	                        .exec(function(err, miembros) {
	                if (err) {
	                  handleError(err, res, done);
	                  return;
	                }
	                if (miembros) {

	                    var msg = {
	                        "familia": familia,
	                        "miembrosFamilia": miembros
	                    };
	                    //console.log(JSON.stringify(msg, null, 2));
	                    //console.log(JSON.stringify(miembros, null, 2));

	                    returnJson(res, msg);
	                }
	            });
	        }
	    });
	});

	function returnJson(res, msg, statusCode) {
	    statusCode = statusCode || 200;

	    res.status(statusCode)
	        .json(msg)
	        .end();  
	}

}

module.exports.apply = apply;
