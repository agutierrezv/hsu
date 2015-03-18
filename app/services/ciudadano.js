//Ciudadano Services -----------------------

function deleteImage(imgModel, imgId, res, done, callback) {
    imgModel.remove({ _id: imgId }, function (err, img3) {
        if (err) {
          handleError(err, res, done);
          return;
        }
        else {
            callback(res, done);
        }
    });
}

function saveImageAndCiudadano(req, res, done, BinaryContentModel, ciudadano) {
   //var buffer = new Buffer(req.body.content, 'base64');
    base64Content = req.body.content;

    var img = new BinaryContentModel({ 
        fileName     : req.body.fileName,
        size         : req.body.size,
        mimeType     : req.body.mimeType,
        content      : base64Content,   
        lastModified : new Date(),
        description  : req.body.description
    });
    saveImage(img, ciudadano, res, done, saveCiudadano);
}

function saveImage(img, ciudadano, res, done, saveCiudadanoCallback) {
    if (img.size == null || img.size === 0) {
        ciudadano.fotoId = null;
        saveCiudadanoCallback(ciudadano, res, done);
    }
    else {
        img.save(function (err, img3) {
            if (err) {
              handleError(err, res, done);
              return;
            }
            if (img3) {
                ciudadano.fotoId = img3._id;
                saveCiudadanoCallback(ciudadano, res, done);
            }
        });
    }
}
function saveCiudadano(ciudadano, res, done) {
    ciudadano.save(function (err, ciudadano2) {
        if (err) {
          handleError(err, res, done);
          return;
        }
        if (ciudadano2) {
            returnChangePhotoResult(res, done, ciudadano2.fotoId);  
        }
    });
}

function returnChangePhotoResult(res, done, fotoId) {
    res.status(200)
        .type('application/json')
        .send( { 'fotoId':  fotoId } ) 
        .end();  
}

function handleError(err, res, done) {
    console.error(err);

    if (err.code === 11000) {
        //MongoDB duplicate key - invalid operation
         res.status(412) //precondition failed
            .type('application/json')
            .send({'error': err})
            .end();  
        return;
    }

    res.status(500)
        .type('application/json')
        .send({'error': err})
        .end();  
    //done();
}

function returnJson(res, msg, statusCode) {
    statusCode = statusCode || 200;

    res.status(statusCode)
        .type('application/json')
        .send(msg)
        .end();  
}

function apply(models) {

	var ciudadanoController     = models.models.ciudadano.controller;
	var binaryContentControler  = models.models.binaryContent.controller;
	var pasController    		= models.models.planAsistencial.controller;

	ciudadanoController.post('/lookupCiudadano', function(req, res, done) {
		var CiudadanoModel  = ciudadanoController.model();
		var PasModel 		= pasController.model();

		CiudadanoModel
		.where({ 
			tipoIdentificador: req.body.tipoDoc,
			identificador: req.body.docNumber,
		})
	  	.findOne(function (err, ciudadano) {
			if (err) {
				return handleError(err, res, done);
			}
			if (ciudadano) {
				var msg = {
					tipoDoc: 	req.body.tipoDoc,
					idNum:   	req.body.docNumber,
					'ciudadano': ciudadano,
					exists: true,
					sugerencia: null
				};
				return returnJson(res, msg, 200);
			}
			else {
				//Not found. lookup in PAS
				PasModel
				.where({ 
					tipoIdentificador: 			req.body.tipoDoc,
					identificacionCiudadano: 	req.body.docNumber,
				})
			  	.findOne(function (err, pas) {
			  		if (err) {
						return handleError(err, res, done);
					}
					if (pas) {
						var msg = {
							tipoDoc: 	req.body.tipoDoc,
							idNum:   	req.body.docNumber,
							ciudadano: 	null,
							exists: 	false,
							sugerencia: {
								nombre:  	pas.nombre,
								apellido1: 	pas.apellido1,
								apellido2: 	pas.apellido2
							}
						};
						return returnJson(res, msg, 200);
					}
					else {
						var msg2 = {
							tipoDoc: 	req.body.tipoDoc,
							idNum:   	req.body.docNumber,
							ciudadano: 	null,
							exists: 	false,
							sugerencia: null
						};
						return returnJson(res, msg2, 200);
					}
			  	});
			}
		});

	});

	// POST /ciudadano/changePhoto
	ciudadanoController.post('/changePhoto/:id', function(req, res, done) {
	    //console.log("LOG /changePhoto/" + req.params.id);

	    var CiudadanoModel = ciudadanoController.model();
	    var BinaryContentModel = binaryContentControler.model();
	    
	    CiudadanoModel.where({ _id: req.params.id}).findOne(function (err, ciudadano) {
	        if (err) {
	          handleError(err, res, done);
	          return;
	        }
	        if (ciudadano) {
	            //console.log("  Ciudadano found" + req.params.id);
	            if (ciudadano.fotoId != null) {
	                deleteImage(BinaryContentModel, ciudadano.fotoId, res, done, function(res, done) {
	                    saveImageAndCiudadano(req, res, done, BinaryContentModel, ciudadano);
	                });
	            }
	            else {
	                saveImageAndCiudadano(req, res, done, BinaryContentModel, ciudadano);
	            }
	        }
	    });
	});



	//Get image
	binaryContentControler.get('/img/:id', function(req, res, done) {
	    var BinaryContentModel = binaryContentControler.model();
	    
	    BinaryContentModel.where({ _id: req.params.id}).findOne(function (err, binaryContent) {
	        if (err) {
	          handleError(err, res, done);
	          return;
	        }
	        if (binaryContent && binaryContent.content != null) {
	            var buffer = new Buffer(binaryContent.content, 'base64'); 
	            //serve image file with its mime type
	            res.status(200)
	                .type(binaryContent.mimeType)
	                .send(buffer)
	                .end();  
	            done();
	        }
	        else {
	            res.status(404)
	                .type('application/json')
	                .send({'error': 'Not found'})
	                .end();  
	            done();             
	        }
	    });
	});

}
module.exports.apply = apply;