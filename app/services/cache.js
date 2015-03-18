//Cache services------
function addCache60mins(req, res, next) {	
	addCache(req, res, 3600); //60 min	
	next();
}
function addCache(req, res, seconds) {
    res.append('Cache-Control', 'public, max-age=' + seconds);
}

function apply(models) {
	var localidadController = models.models.localidad.controller;
	var municipioController = models.models.municipio.controller;

	//cache 
	localidadController.query('get', addCache60mins);
	municipioController.query('get', addCache60mins);
}
module.exports.apply = apply;