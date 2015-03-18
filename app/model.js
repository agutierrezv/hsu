//Data model for HSU ---------------
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// Create Mongoose schemas
var StaticDataSchema = new mongoose.Schema({ 
  	type:  { type: String, required: true },
	key:   { type: String, required: true },
	label: { type: String, required: false },
	description: { type: String, required: false },
})
.index({ type: 1, key: 1 }, { unique: true });

var LocalidadSchema = new mongoose.Schema({ 
	key:   { type: String, required: true },
	label: { type: String, required: true },
	description: { type: String, required: false },
})
.index({ key: 1 }, { unique: true });

var MunicipioSchema = new mongoose.Schema({ 
	key:   { type: String, required: true },
	label: { type: String, required: true },
	description: { type: String, required: false },
})
.index({ key: 1 }, { unique: true });


var BinaryContentSchema = new mongoose.Schema({ 
	fileName: { type: String, required: false },
  	content:  { type: String, required: false },   //Buffer
  	mimeType: { type: String, required: false },
  	size:     { type: Number, required: false },
  	lastModified:  { type: Date, required: true, default: Date.now },
	description: { type: String, required: false },
});

var EntidadSchema = new mongoose.Schema({ 
  	codigo: { type: String, required: true },
	denominacion: { type: String, required: true },
	esPublico: { type: Boolean, required: true },
	codigoCalejero: { type: String, required: false },
	tipoVia: { type: String, required: true },
	nombreVia: { type: String, required: true },
	numeroVia: { type: Number, required: false },
	accesorio: { type: String, required: false },
	bloque: { type: Number, required: false },
	escalera: { type: Number, required: false },
	piso: { type: Number, required: false },
	letra: { type: String, required: false },
	codigoPostal: { type: String, required: true },
	localidadIne: { type: String, required: false },
	municipioIne: { type: String, required: false },
	provinciaIne: { type: String, required: false },
	telefono1: { type: String, required: false },
	telefono2: { type: String, required: false },
	email: { type: String, required: false },
	contacto: { type: String, required: false }
})
.index({ codigo: 1 }, { unique: true });

var RecursoSchema = new mongoose.Schema({ 
  	codigo: { type: String, required: true },
	denominacion: { type: String, required: true },
	esPublico: { type: Boolean, required: true },
	codigoCalejero: { type: String, required: false },
	tipoVia: { type: String, required: true },
	nombreVia: { type: String, required: true },
	numeroVia: { type: Number, required: false },
	accesorio: { type: String, required: false },
	bloque: { type: Number, required: false },
	escalera: { type: Number, required: false },
	piso: { type: Number, required: false },
	letra: { type: String, required: false },
	codigoPostal: { type: String, required: true },
	localidadIne: { type: String, required: false },
	municipioIne: { type: String, required: false },
	provinciaIne: { type: String, required: false },
	telefono1: { type: String, required: false },
	telefono2: { type: String, required: false },
	email: { type: String, required: false },
	contacto: { type: String, required: false },
	sector: { type: String, required: false },
	tipologia: { type: String, required: false },
	centroServicio: { type: String, required: false },
	ambitoGeografico: { type: String, required: false },
	numeroPlazas: { type: Number, required: false },
	plazasOcupadas: { type: Number, required: false },
	plazasDisponibles: { type: Number, required: false },
	costeDisponibilidad: { type: Number, required: false },
	plazasReservadas: { type: Number, required: false },
	entidadTitular: { type: String, required: false },
	entidadGestora: { type: String, required: false }
})
.index({ codigo: 1 }, { unique: true });

var ProfesionalSchema = new mongoose.Schema({ 
  	codigo: { type: String, required: true },
	tipoIndentificador: { type: String, required: true },
	identificador: { type: String, required: true },
	prefijo: { type: String, required: false },
	nombre: { type: String, required: true },
	apellido1: { type: String, required: true },
	apellido2: { type: String, required: false },
	telefono: { type: String, required: false },
	email: { type: String, required: false },
	tipologia: { type: String, required: false },
	sector: { type: String, required: false },
	esPublico: { type: Boolean, required: true },
	acreditado: { type: Boolean, required: true },
	ambitoGeografico: { type: String, required: false },
	nivel: { type: String, required: false },
	perfil: { type: String, required: false }
})
.index({ codigo: 1 }, { unique: true });

var CiudadanoSchema = new mongoose.Schema({ 
  	ciudadanoId: { type: Number, required: true },
	identificador: { type: String, required: true },
	tipoIdentificador: { type: String, required: true },
	nombre: { type: String, required: true },
	apellido1: { type: String, required: true },
	apellido2: { type: String, required: false },
	sexo: { type: String, required: true },
	estadoCivil: { type: String, required: true },
	parejaDeHecho: { type: Boolean, required: false },
	fechaNacimiento: { type: Date, required: true },
	provinciaNacimiento: { type: String, required: true },
	paisDeNacimiento: { type: String, required: true },
	nacionalidad: { type: String, required: true },
	ingresosAnuales: { type: Number, required: true },
	empadronamiento: { type: Boolean, required: false },
	fechaEmpadronamiento: { type: Date, required: false },
	causaBaja: { type: String, required: false },
	fechaBaja: { type: Date, required: false },
	telefono1: { type: String, required: false },
	telefono2: { type: String, required: false },
	email: { type: String, required: false },
	discapacidad: { type: Boolean, required: false },
	gradoDiscapacidad: { type: String, required: false },
	diagnostico: { type: String, required: false },
	valoracionDependencia: { type: String, required: false },
	rae: { type: String, required: true },
	ocupacion: { type: String, required: true },
	situacionHistoriaLaboral: { type: String, required: false },
	annosResidenciaCCAA: { type: Number, required: true },
	annosResidenciaMunicipio: { type: Number, required: true },
	nivelEstudios: { type: String, required: true },
	tarjetaSanitaria: { type: Number, required: true },
	coberturaSanitaria: { type: String, required: true },
	medico: { type: String, required: false },
	centroSalud: { type: String, required: false },
	direccionCentroSalud: { type: String, required: false },
	telefonoCentroSalud: { type: String, required: false },
	horarioConsultaCentroSalud: { type: Date, required: false },
	observaciones: { type: String, required: false },
	fotoId:        { type: ObjectId, required: false, ref: "binaryContent" },
	familia: 	   { type: ObjectId, required: false, ref: "familia"} 
})
.index({ ciudadanoId: 1 }, { unique: true })
.index({ tipoIdentificador: 1, identificador: 1}, { unique: true });

var FamiliaSchema = new mongoose.Schema({ 
  	codigo: { type: Number, required: true },
  	nombreFamilia: { type: String, required: true },
	codigoCallejero: { type: String, required: true },
	tipoVia: { type: String, required: true },
	nombreVia: { type: String, required: true },
	numeroVia: { type: Number, required: true },
	accesorio: { type: String, required: false },
	bloque:    { type: String, required: false },
	escalera:  { type: String, required: false },
	piso:      { type: Number, required: false },
	letra:     { type: String, required: false },
	codigoPostal: { type: String, required: false },
	localidadIne: { type: String, required: true },
	municipioIne: { type: String, required: true },
	provinciaIne: { type: String, required: true },
	telefono:     { type: String, required: false },
	miembros: 	  [{ type: ObjectId, ref: 'miembro' }], 
})
.index({ codigo: 1 }, { unique: true });

var MiembroSchema = new mongoose.Schema({ 
  	familia: { type: ObjectId, required: true, ref: 'familia' },
	ciudadano: { type: ObjectId, required: true, ref: 'ciudadano' },
	fechaAlta: { type: Date, required: true, default: Date.now },
	parentesco: { type: String, required: false },
	fechaBaja: { type: Date, required: false },
	causaBaja: { type: String, required: false }
})
.index({ familia: 1 }, { unique: false })
.index({ ciudadano: 1 }, { unique: true })
.index({ familia: 1, ciudadano: 1 }, { unique: true });


//Modelo de persistencia para diagnostico social -----
var PreguntaSchema = new mongoose.Schema({
	clave:     { type: String, required: true },
	respuesta: { type: String, required: false }
});

var FormularioSchema = new mongoose.Schema({
	tipo:       { type: String, required: false },
	valoracion: { type: String, required: false },
	preguntas:  [ PreguntaSchema ]
});

var DiagnosticoSocialSchema = new mongoose.Schema({ 
  	familiaId:   { type: ObjectId, required: true, ref: 'familia' },
  	profesional: { type: ObjectId, required: false, ref: 'profesional' },
	version:     { type: Date,     required: true },
	estado:      { type: String,   required: true },
	valoracion:  { type: String,   required: false },
	observaciones:  { type: String,   required: false },
	formularios: [ FormularioSchema ]
})
.index({ codigo: 1, version: -1 }, { unique: true });


var PlanAsistencialSchema = new mongoose.Schema({ 
  	codigo: { type: String, required: true },
	domicilioFamiliar: { type: String, required: false },
	tipoIdentificador: { type: String, required: false },
	identificacionCiudadano: { type: String, required: true },
	nombre: { type: String, required: true },
	apellido1: { type: String, required: true },
	apellido2: { type: String, required: false },
	fechaApertura: { type: Date, required: true, default: Date.now },
	fechaCierre:   { type: Date, required: false },
	familia: 	   { type: ObjectId, required: false, ref: 'familia' },
	profesionalId: { type: ObjectId, required: false, ref: 'profesional' },
	profesionalReferencia: { type: String, required: false },
	prestaciones: [{ 
		nombre:            { type: String, required: true },
		asignacionDirecta: { type: Boolean, required: false },
		fechaAsignacion:   { type: Date, required: false },
		fechaApertura:     { type: Date, required: true, default: Date.now },
		fechaInicioTramite:{ type: Date, required: false },
		fechaResolucion:   { type: Date, required: false },
		estado:            { type: String, required: false },
		estadoTramite:     { type: String, required: false }
	}]
})
.index({ codigo: 1 }, { unique: true });

var GeoPointSchema = new mongoose.Schema({ 
  	nombre: { type: String, required: true },
	descripcion: { type: String, required: false },
	tipo: { type: String, required: false },
	longitud: { type: Number, required: true },
	latitud: { type: Number, required: true },
	medicion: { type: String, required: false },
	valor: { type: Number, required: false },
	unidad: { type: String, required: false }
});

var ServicioSchema = new mongoose.Schema({ 
  	codigo: { type: String, required: true },
	descripcion: { type: String, required: false },
	colectivo: { type: String, required: false },
	caracteristicas: { type: String, required: false },
	solicitudDocumentacion: { type: String, required: false },
	plazoInicio: { type: Date, required: false },
	plazoFin: { type: Date, required: false },
	lugarDePresentacion: { type: String, required: false },
	contacto: { type: String, required: false },
	instanciaDeParte: { type: Boolean, required: false },
	asignacionDirecta: { type: Boolean, required: false }
})
.index({ codigo: 1 }, { unique: true });


var propertiesForClass = {
	"entidad" : ['codigo', 'denominacion', 'esPublico', 'codigoCalejero', 'tipoVia', 'nombreVia', 'numeroVia', 'accesorio', 'bloque', 'escalera', 'piso', 'letra', 'codigoPostal', 'localidadIne', 'municipioIne', 'provinciaIne', 'telefono1', 'telefono2', 'email', 'contacto'],
	"recurso" : ['codigo', 'denominacion', 'esPublico', 'codigoCalejero', 'tipoVia', 'nombreVia', 'numeroVia', 'accesorio', 'bloque', 'escalera', 'piso', 'letra', 'codigoPostal', 'localidadIne', 'municipioIne', 'provinciaIne', 'telefono1', 'telefono2', 'email', 'contacto', 'sector', 'tipologia', 'centroServicio', 'ambitoGeografico', 'numeroPlazas', 'plazasOcupadas', 'plazasDisponibles', 'costeDisponibilidad', 'plazasReservadas', 'entidadTitular', 'entidadGestora'],
	"profesional" : ['codigo', 'tipoIndentificador', 'identificador', 'prefijo', 'nombre', 'apellido1', 'apellido2', 'telefono', 'email', 'tipologia', 'sector', 'esPublico', 'acreditado', 'ambitoGeografico', 'nivel', 'perfil'],
	"ciudadano" : ['ciudadanoId', 'identificador', 'tipoIdentificador', 'nombre', 'apellido1', 'apellido2', 'sexo', 'estadoCivil', 'parejaDeHecho', 'fechaNacimiento', 'provinciaNacimiento', 'paisDeNacimiento', 'nacionalidad', 'ingresosAnuales', 'empadronamiento', 'fechaEmpadronamiento', 'causaBaja', 'fechaBaja', 'telefono1', 'telefono2', 'email', 'discapacidad', 'gradoDiscapacidad', 'diagnostico', 'valoracionDependencia', 'rae', 'ocupacion', 'situacionHistoriaLaboral', 'annosResidenciaCCAA', 'annosResidenciaMunicipio', 'nivelEstudios', 'tarjetaSanitaria', 'coberturaSanitaria', 'medico', 'centroSalud', 'direccionCentroSalud', 'telefonoCentroSalud', 'horarioConsultaCentroSalud', 'observaciones'],
	"miembro" : ['familiaId', 'ciudadanoId', 'fechaAlta', 'parentesco', 'fechaBaja', 'causaBaja'],
	"planAsistencial" : ['codigo', 'domicilioFamiliar', 'ciudadanoId', 'identificacionCiudadano', 'nombre', 'apellido1', 'apellido2', 'fechaSolicitud', 'fechaApertura', 'profesionalId', 'profesionalReferencia'],
	"geoPoint" : ['nombre', 'descripcion', 'tipo', 'longitud', 'latitud', 'medicion', 'valor', 'unidad'],
	"servicio" : ['codigo', 'descripcion', 'colectivo', 'caracteristicas', 'solicitudDocumentacion', 'plazoInicio', 'plazoFin', 'lugarDePresentacion', 'contacto', 'instanciaDeParte'],
	"familia" : ['codigo', 'nombreFamilia', 'codigoCallejero', 'tipoVia', 'nombreVia', 'numeroVia', 'accesorio', 'bloque', 'escalera', 'piso', 'letra', 'codigoPostal', 'localidadIne', 'municipioIne', 'provinciaIne'],
	//"familia" : ['codigo', 'codigoCallejero', 'tipoVia', 'nombreVia', 'numeroVia', 'accesorio', 'bloque', 'escalera', 'piso', 'letra', 'codigoPostal', 'localidadIne', 'municipioIne', 'provinciaIne', 'centroSSSS', 'uts', 'profesionalReferencia', 'telefono1', 'telefono2', 'email', 'ingresosPensiones', 'bienesUrbanosArrendados', 'bienesUrbanosSinArrendar', 'bienesRusticosArrendados', 'bienesRusticosSinArrendar', 'interesesCapitalMobiliario', 'otrosIngresosFamiliares', 'situacionEconomica', 'tipoVivienda', 'personas', 'regimenTenencia', 'superficie', 'habitaciones', 'm2xPersona', 'costeAnual', 'aguaCorriente', 'aguaCaliente', 'wc', 'telefono', 'ducha', 'frigorifico', 'electricidad', 'calefaccion', 'gas', 'lavadora', 'barrerasArquitectonicas', 'amenzaRuina', 'faltaIluminacionNatural', 'faltaVentilacion', 'deteriorada', 'inadecuadaDistribucion', 'malasCondiciones', 'aceptable'],
	"staticData": ['type', 'key', 'label', 'description'],
	"localidad":  ['key', 'label', 'description'],
	"municipio":  ['key', 'label', 'description'],
	"binaryContent": ['fileName', 'content', 'mimeType', 'size', 'lastModified', 'description'],
	"diagosticoSocial": [] //todo
};


function buildModelForSchema(container, entityName, pluralName, schema) {
	var entityModel = mongoose.model(entityName, schema);
	entityModel.plural(pluralName);

	container[entityName] = {
		'name': entityName,
		'plural': pluralName,
		'schema': schema,	
		'model': entityModel
	};
}
function getModelForClass(className) {
	var item = models[className];
	if (item == null) {
		return null;
	}
	return item.model;
}

var models = {};

//Models ----
buildModelForSchema(models, 'staticData', 'staticData', StaticDataSchema);
buildModelForSchema(models, 'binaryContent', 'binaryContent', BinaryContentSchema);
buildModelForSchema(models, 'localidad', 'localidades', LocalidadSchema);
buildModelForSchema(models, 'municipio', 'municipios', MunicipioSchema);

buildModelForSchema(models, 'entidad', 'entidades', EntidadSchema);
buildModelForSchema(models, 'recurso', 'recursos', RecursoSchema);
buildModelForSchema(models, 'profesional', 'profesionales', ProfesionalSchema);
buildModelForSchema(models, 'ciudadano', 'ciudadanos', CiudadanoSchema);
buildModelForSchema(models, 'familia', 'familias', FamiliaSchema);
buildModelForSchema(models, 'miembro', 'miembros', MiembroSchema);
buildModelForSchema(models, 'planAsistencial', 'planesAsistenciales', PlanAsistencialSchema);
buildModelForSchema(models, 'geoPoint', 'geopoints', GeoPointSchema);
buildModelForSchema(models, 'servicio', 'servicios', ServicioSchema);
buildModelForSchema(models, 'diagnosticoSocial', 'diagnosticoSocial', DiagnosticoSocialSchema);


// Register the schema and export it
module.exports.models    			= models;
module.exports.getModelForClass 	= getModelForClass;
module.exports.propertiesForClass 	= propertiesForClass;
