angular.module('myApp').service('MetadataService', [function () {
	var MetadataService = {};


	var metaData = {
		"entidad" 		: 	["codigo","denominacion","esPublico","codigoCalejero","tipoVia","nombreVia","numeroVia","accesorio","bloque","escalera","piso","letra","codigoPostal","localidadIne","municipioIne","provinciaIne","telefono1","telefono2","email","contacto"],
		"recurso" 		: 	["codigo","denominacion","esPublico","codigoCalejero","tipoVia","nombreVia","numeroVia","accesorio","bloque","escalera","piso","letra","codigoPostal","localidadIne","municipioIne","provinciaIne","telefono1","telefono2","email","contacto","sector","tipologia","centroServicio","ambitoGeografico","numeroPlazas","plazasOcupadas","plazasDisponibles","costeDisponibilidad","plazasReservadas","entidadTitular","entidadGestora"],
		"profesional" 	: 	["codigo","tipoIndentificador","identificador","prefijo","nombre","apellido1","apellido2","telefono","email","tipologia","sector","esPublico","acreditado","ambitoGeografico","nivel","perfil"],
		"ciudadano" 	: 	["ciudadanoId","identificador","tipoIdentificador","nombre","apellido1","apellido2","sexo","estadoCivil","parejaDeHecho","fechaNacimiento","provinciaNacimineto","paisDeNacimiento","nacionalidad","ingresosAnuales","empadronamiento","fechaEmpadronamiento","causaBaja","fechaBaja","telefono1","telefono2","email","discapacidad","gradoDiscapacidad","diagnostico","valoracionDependencia","rae","ocupacion","situacionHistoriaLaboral","annosResidenciaCCAA","annosResidenciaMunicipio","nivelEstudios","tarjetaSanitaria","coberturaSanitaria","medico","centroSalud","direccionCentroSalud","telefonoCentroSalud","horarioConsultaCentroSalud","observaciones"],
		"miembro" 		: 	["familiaId","ciudadanoId","fechaAlta","parentesco","fechaBaja","causaBaja"],
		"planAsistencial" 		: 	["codigo","domicilioFamiliar","ciudadanoId","identificacionCiudadano","nombre","apellido1","apellido2","fechaSolicitud","fechaApertura","profesionalId","profesionalReferencia"],
		"geoPoint" 		: 	["nombre","descripcion","tipo","longitud","latitud","medicion","valor","unidad"],
		"servicio" 		: 	["codigo","descripcion","colectivo","caracteristicas","solicitudDocumentacion","plazoInicio","plazoFin","lugarDePresentacion","contacto","instanciaDeParte", "asignacionDirecta"],
		"familia" 		:   ['codigo', 'codigoCallejero', 'tipoVia', 'nombreVia', 'numeroVia', 'accesorio', 'bloque', 'escalera', 'piso', 'letra', 'codigoPostal', 'localidadIne', 'municipioIne', 'provinciaIne'],
		"staticData"	: 	['type', 'key', 'label', 'description'],
		"localidad"		: 	['key', 'label', 'description'],
		"municipio"		: 	['key', 'label', 'description'],
		"diagosticoSocial": [] //todo
	};

	MetadataService.getPropertiesFor = function (className) {
		return (metaData[className] || [] ).slice(0);
	};

	return MetadataService;

}]);

