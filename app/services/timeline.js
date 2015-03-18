//timeline services -----------------

function removeReplicatedYears(col) {
	var lastYear = null;
	return col.map(function (item) {
		if (item.year != lastYear) {
			lastYear = item.year;
		}
		else {
			item.year = null;
		}
		return item;
	});
}

function diagnosticosToTimeLine(diags) {
	var res = [];
	if (!diags) {
		return res;
	}
	diags.forEach(function(dia) {
		var newTimeLine = {
			fecha: dia.version,
			year:  getYearFromISODate(dia.version),
			titulo: 'Diagnóstico Social', 
			descripcion: [ 'Resultado: ' + valoracionToLabel(dia.valoracion),
						   dia.observaciones
			],
			estado: dia.estado,
			revisiones: [
				/*{
					fecha: null,
					titulo: '',
					cuantiaAnterior: 0
				}*/
			],
			masInfoUrl: '/#/diagnosticoSocial/version/'+dia._id,
			masInfoLabel: 'ver diagnóstico'
		};
		res.push(newTimeLine);
	});
	return res;
}

function valoracionToLabel(valCode) {
	//todo (transform if needed)
	return valCode;
}

function pasToTimeLine(pasCollection, ciudadanoId) {
	var res = [];
	if (!pasCollection) {
		return res;
	}
	pasCollection.forEach(function(pas) {
		pas.prestaciones.forEach(function(prestacion) {	
			//if (ciudadanoId && prestacion.ciudadanoId == ciudadanoId) {
			if (true) {  //provisional <- filter by ciudadano

				if (prestacion.estado !== 'concedido' &&
					prestacion.estado !== 'asignado directamente'
					) {
					//solo incluir las prestaciones concedidas  estado ="concedido"
					return; //skip
				}

				var newTimeLine = {
					fecha: prestacion.fechaApertura,
					year:  getYearFromISODate(prestacion.fechaApertura),
					titulo: prestacion.nombre, 
					descripcion: [ 
						prestacion.nombre
					],
					estado: prestacion.estado,
					revisiones: [
						/*{
							fecha: null,
							titulo: '',
							cuantiaAnterior: 0
						}*/
					],
					masInfoUrl: '/#/pas/detalle/'+pas._id,
					masInfoLabel: 'ver PAS'
				};

				res.push(newTimeLine);
			}
		});
	});
	return res;		
}
function getYearFromISODate(isoStringDate) {
	return new Date(isoStringDate).getFullYear();
}
function sortTimeLine(col) {
	col.sort(timeLineDescSorter);
	return col;
}
function timeLineDescSorter(a, b) {
	var da = getAsDate(a.fecha);
	var db = getAsDate(b.fecha);
	//console.log("log: " + da + " < " + db + " = " + ((db - da) > 0)) ;
	
	return db - da ;  
}

function getAsDate(candidate) {
	if (candidate instanceof Date) {
		return candidate;
	} 
	//else if (typeof candidate === "string") 
	//else if (typeof candidate === "number") 
	return new Date(candidate);
}

function handleError(err, res, done) {
    console.error(err);

    if (err.code === 11000) {
        //MongoDB duplicate key - invalid operation
         res.status(412) //precondition failed
            .json( {'error': err} )
            .end();  
        return;
    }

    res.status(500)
        .json( {'error': err} )
        .end();  
    //done();
}

function returnJson(res, msg, statusCode) {
    statusCode = statusCode || 200;

    res.status(statusCode)
        .json(msg)
        .end();  
}


function apply(models) {

	var ciudadanoController	= models.models.ciudadano.controller;
	var familiaController 	= models.models.familia.controller;


	//Retrieves a ciudadano timeline. Aggregates prestaciones personales ordered by date (desc)
	ciudadanoController.get('/timeline/:id', function(req, res, done) {
	    var ciudadanoId = req.params.id;
	   	var pasModel = models.models.planAsistencial.controller.model();
		var ciudadanoModel = ciudadanoController.model();

	   	ciudadanoModel.findOne({'_id': ciudadanoId}).exec(function(err, ciudadano) {
	   		if (err) {
	            return handleError(err, res, done);
	        }
	        if (ciudadano && ciudadano.familia) {

		        pasModel.find({ 'familia': ciudadano.familia})
					    .sort({ 'fechaApertura'  : -1})
		    			.exec(function(err, pasCollection) {
			        if (err) {
			            return handleError(err, res, done);
			        }
			        
					var tl = pasToTimeLine(pasCollection, ciudadanoId);
					var tl1 = sortTimeLine(tl);
					//console.log(JSON.stringify(tl1, null, 2));
					var tl2 = removeReplicatedYears(tl1);		        						 

		            returnJson(res, tl2);
		        });
	        }
		});
	});

	//Retrieves a family timeline. Aggregates prestaciones & diagnosticos ordered by date (desc)
	familiaController.get('/timeline/:id', function(req, res, done) {
	    var familiaId = req.params.id;
	   	var pasModel = models.models.planAsistencial.controller.model();
	    var diagnosticoModel = models.models.diagnosticoSocial.controller.model();

	    diagnosticoModel.find({ 'familiaId': familiaId})
	    				.sort({ 'version'  : -1})
	    				.exec(function(err, diags) {
	        if (err) {
	            return handleError(err, res, done);
	        }
	        
	        pasModel.find({ 'familia': familiaId})
	    				.sort({ 'fechaApertura'  : -1})
	    				.exec(function(err, pasCollection) {
		        if (err) {
		            return handleError(err, res, done);
		        }
		        
		        var timeLineCollection = diagnosticosToTimeLine(diags)
		        						 .concat(pasToTimeLine(pasCollection));
				timeLineCollection = sortTimeLine(timeLineCollection);
				timeLineCollection = removeReplicatedYears(timeLineCollection);		        						 

	            returnJson(res, timeLineCollection);
	        });
	    });
	});



}
module.exports.apply = apply;
module.exports.sortTimeLine = sortTimeLine;
module.exports.timeLineDescSorter = timeLineDescSorter;
