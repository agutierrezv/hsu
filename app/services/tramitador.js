//Servicios de integracion con el Tramitador -----------------------
var https = require("https");

function updatePrestacionState(models, pasId, prestacionId, state, callback) { 
    var paModel = models.models.planAsistencial.model;

    paModel.where({_id: pasId}).findOne(function(err, pas) {
        if (pas) {
            var prestacion = findPrestacion(pas, prestacionId);
            if (prestacion) {
                //change and update
                prestacion.estadoTramite = state;
                if (state == "concedido" || state== "denegado") {
                    prestacion.fechaResolucion = Date.now();
                    prestacion.estado = state; //propagar
                }
                pas.save();
                console.log("Estado actualizado para PAS:" + pasId + " prestacion: "+ prestacionId + " al estado: " + state);
                return callback(null, pas);
            }
            return callback({ err: "No se encontró prestación." },  null);
        }
        return callback({ err: "No se encontró PAS." },  null);
    });
}

function findPrestacion(pas, prestacionId) {
    for(var i=0; i<pas.prestaciones.length; i++) {
        var pres = pas.prestaciones[i];
        if (pres._id == prestacionId) {
            return pres;
        }
    }
    return null;
}


function findItemByProp(col, target, propName) {
    for(var i=0; i<col.length; i++) {
        var item = col[i];
        if (target[propName] == item[propName]) {
            return item;
        }
    }
    return null;
}

function launchNewTramite(models, pasId, prestacionId, callback) {
    var staticDataModel = models.models.staticData.model;
    var pasModel = models.models.planAsistencial.model;
    var prestacion;

    pasModel.findOne({'_id': pasId}, function(err, pas) {
        if (err) {
             return callback(err);       
        }
        prestacion = getItemById(pas.prestaciones, prestacionId);

        console.log("Lanzando tramite externo para la prestacion: " + pasId + '-'+ prestacionId + " " + prestacion.nombre);
        //Get tramitador conf
        staticDataModel.where({type: "adminSettings"}).exec(function(err, docs) {
            if (docs) {
                var baseUrl = getValueForKey(docs, "key", "tramitadorBaseUrl");
                var port = getValueForKey(docs, "key", "tramitadorPort");
                var path = getValueForKey(docs, "key", "tramitadorPath");
                var user = getValueForKey(docs, "key", "tramitadorUser");
                var password = getValueForKey(docs, "key", "tramitadorPassword");

                //prepare post data 

                var msg = {
                    origin:         'hsu',
                    type:           prestacion.nombre,
                    originId:       pas._id + '-' + prestacion._id,
                    created:        new Date(Date.now()).toISOString(),
                    lastModified:   new Date(Date.now()).toISOString(),
                    description:    pas.identificacionCiudadano + ' - ' + prestacion.nombre,
                    state:          'iniciado',
                    assignedTo:     null
                };
                var body = JSON.stringify(msg, null, 2);

                var options = {
                    host: baseUrl,
                    port: port,
                    path: path,
                    method: 'POST',
                    headers: { 
                        'Origin': 'https://hsu-api.herokuapp.com',
                        'Accept': 'application/json',
                        'Host'  :  baseUrl +':'+ port,
                        'apikey':  password,
                        //'Authorization': 'Basic ' + new Buffer(user + ':' + password).toString('base64'),
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(body)
                    }        
                };

                console.log('Sending to '+options.method+' https://'+ options.host + ':' + options.port + options.path + '\n' +
                    JSON.stringify(options.headers) + '\n\n' +
                    body + '\n\nSize: '+Buffer.byteLength(body));

                var output = '';
                var req2 = https.request(options, function(resp){
    	            console.log('STATUS: ' + resp.statusCode);
    	            console.log('HEADERS: ' + JSON.stringify(resp.headers));
    	            resp.setEncoding('utf8');
    	            resp.on('data', function(chunk){
    	               	output += chunk;
    	            });
                  	resp.on('end', function() {
                    	console.log('Response:\n'+ output);   
                        callback(null, JSON.parse(output));             
                 	});
                }).on("error", function(e){
                  	console.log("Got error: " + e.message);
                    callback(e, null);             
                });

                req2.write(body);
                req2.end();
            }
        });

    });
}

function getValueForKey(col, keyField, keyValue) {
    for(var i=0; i < col.length; i++) {
        var item = col[i];
        if (item[keyField] == keyValue) {
            return item.label;
        }
    }
    return null;
}

function getItemById(col, id) {
    for(var i=0; i<col.length; i++) {
        var item = col[i];
        if (item.id === id) {
            return item;
        }
    }
    return null; 
}

function apply(app, models) {

    var planAsistencialController = models.models.planAsistencial.controller;

    planAsistencialController.post('/iniciarTramite', function(req, res, next) {
        var pasId = req.body.pasId;
        var prestacionId = req.body.prestacionId;
        launchNewTramite(models, pasId, prestacionId, function(error, okData) {
            if (error) {
                return res.status(500).json(error).end();
            }
            else {                
                var pasModel = planAsistencialController.model();
                pasModel.findOne({'_id': pasId}).exec(function(err, pas1) {
                    if (err) {
                        return res.status(500).json(err).end();
                    }
                    else {
                        var prestacion = getItemById(pas1.prestaciones, prestacionId);
                        if (prestacion) {
                            prestacion.estado = "en tramite";
                            prestacion.estadoTramite = okData.state;
                            prestacion.fechaInicioTramite = okData.created;

                            pas1.save(function(err, pas1) {
                                if (err){
                                    return res.status(500).json(err).end();
                                }
                                else {
                                   res.status(200).json({success: true}); 
                                }
                            });
                        }
                        else {
                            return res.status(404).json({ error: 'No se encontro prestacion.'}).end();
                        }
                    }
                });
            }
        });
    });



	//Webhook para tramitador
	app.post('/api/prestacionUpdateStatus', function(req, res) {

        //console.log("Getting data on /api/prestacionUpdateStatus: ");

        var payload = JSON.stringify(req.body, null, 2); 
        var data = req.body;
        console.log("Tramitador Update Status. Id: " + data.originId );
        console.log( 'Payload: ' + payload );

        var parts = data.originId.match(/(\w+)-(\w+)/);
        if (parts) {
            var pasId = parts[1];
            var prestacionId = parts[2];
            var state = data.state;

            updatePrestacionState(models, pasId, prestacionId, state, function(err, ok) {
                if (err) {
                    console.error("ERROR: 501. " + JSON.stringify(err, null, 2));
                    res.status(501)
                        .json(err)
                        .end();   
                }
                else {
                    //console.log("OK 200");
                    res.status(200)
                        .json({ result: 'ok' })
                        .end();   
                }                 
            });
        }
        else {
            res.status(404)
                .json({ 
                    result: 'Not found.',
                    message: 'Document with id: ' + data.originId + ' was not found.'
                })
                .end();    
        }
	}); 


}
module.exports.apply = apply;