angular.module('myApp').service('DiagnosticoSocialService', ['$http', '$q', 'UrlService', 'baseApi', function ($http, $q, UrlService, baseApi) {

	var Service = {};

	var resourceUrl;
	var docUrl;
	var docUrlReceived;
	var resourceUrlReceived;

	// Getting the entidad API documentation URL and a promise to know when it's loaded.
	docUrlReceived = UrlService.diagnosticoSocialUrl.then(function (url) {
		docUrl = url;
	});

	// When the documentation is received, getting the entidads resource URL and a promise to know when it's loaded.
	docUrlReceived.then(function () {
		resourceUrlReceived = $http.get(docUrl).success(function (response) {
			resourceUrl = baseApi + response.resourcePath;
		});
	});

	// Function wrapper verifying URL is available before any API call.
	var safeCall = function (functionToCall) {
		return function () {
			var args = Array.prototype.slice.call(arguments);
			var deferred = $q.defer();

			// When the doc URL is available.
			docUrlReceived.then(function () {
				// When the resource URL is available.
				resourceUrlReceived.then(function () {
					deferred.resolve(functionToCall.apply(this, args));
				});
			});
			return deferred.promise;
		};
	};

	function buildBaucisQuery(opts) {
		var q ='?';
		var prefix='';
		if (opts.page == null && opts.blockSize == null) {			
		}
		else {
			opts.page = opts.page || 1;
			opts.pageSize = opts.pageSize || 20;
			
			var skip =  (opts.page-1)*opts.pageSize;
			if(skip > 0) {
				q += prefix + 'skip=' + skip;
				prefix='&';			
			}
			q += prefix + '&limit=' + opts.pageSize;
			prefix='&';
		}
		if (opts.sort) {
			q += prefix + 'sort=' + encodeURIComponent(opts.sort) + '';
			prefix='&';
		}			
		if (opts.criteria) {
			q += prefix + 'conditions={' + encodeURIComponent(opts.criteria) + '}';
			prefix='&';
		}
		if (opts.select) {
			q += prefix + 'select={' + encodeURIComponent(opts.select) + '}';
			prefix='&';
		}
		if (opts.populate) {
			q += prefix + 'populate={' + encodeURIComponent(opts.populate) + '}';
			prefix='&';
		}
		if (opts.hint) {
			q += prefix + 'hint={' + encodeURIComponent(opts.hint) + '}';
			prefix='&';
		}
		if (opts.count === true) {
			q += prefix + 'count=true';
			prefix='&';
		}
		if (opts.searchText && opts.searchText!=='') {
			//Do a custom like query
			var likeQuery = buildLikeQuery(opts.searchText);   
			q += prefix + 'conditions={' + encodeURIComponent(likeQuery) + '}';
			prefix='&';
		}
		return q;
	}

	function buildLikeQuery(searchText) {
		var res='"$or":[';
		//add string fields
		var clauses = [];
		var clause = null;

		//Process each property

		clause = addStringLike('estado', searchText);
		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('valoracion', searchText);
		if (clause != null){
			clauses.push(clause);
		}

		var prefix='';
		clauses.forEach(function(item) {
			res += prefix+item;
			prefix=',';
		});
		res += ']';

		if (clauses.length>0) {
			return res;
		}
		return '';
	}

	function addStringLike(property, searchValue) {
		if (searchValue == null){
			return null;
		}
		return '{"'+ property +'":{"$regex":"' + escapeForRegex(searchValue) + '","$options":"i"}}';
	}
	function addNumberLike(property, searchValue) {
		if (!isNumber(searchValue)) {
			return null;
		}
		var num = Number(searchValue);
		return '{"'+ property +'":' +  num + '}';
	}
	function addBooleanLike(property, searchValue) {
		var boolValue = strToBool(searchValue);
		if (boolValue == null) {
			return null;
		}
		return '{"'+ property +'":' +  boolValue + '}';			
	}
	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function escapeForRegex(candidate) {
		//escape values for regex
		return candidate;
	}
	var boolValues = {
		"true"	: "true",
		"yes" 	: "true",
		"false"	: "false",
		"no"	: "false"
	};
	function strToBool(candidate) {
		var value = candidate.toLowerCase();
		var boolVal = boolValues[value];

		if (boolVal == null) {
			return null;
		}
		return boolVal;
	}


	function buildMongooseQuery(opts) {
		var q = '';
		if (opts.searchText && opts.searchText!=='') {
			var likeQuery = buildMoongooseLikeQuery(opts.searchText);   
			q = '{' + likeQuery + '}';			
		}
		return q;
	}

	function buildMoongooseLikeQuery(searchText) {
		var res='"$or":[';
		//add string fields
		var clauses = [];
		var clause = null;

		//Process each property
		
		clause = addStringLike('estado', searchText);
		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('valoracion', searchText);
		if (clause != null){
			clauses.push(clause);
		}
		
		var prefix='';
		clauses.forEach(function(item) {
			res+=prefix+item;
			prefix=',';
		});
		res += ']';

		if (clauses.length>0) {
			return res;
		}
		return '';
	}

	//-- Public API -----

	Service.getCount =  safeCall(function (opts) {
		opts = opts || {};
		opts.count = true;		
		var q = buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});
	
	Service.getList = safeCall(function (opts) {
		opts = opts || {};
		var q = buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});

	Service.getListAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl, 
			headers: {'Accept': 'text/csv'} 
		});
	});	

	Service.getFileAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/csv/', 
			headers: {'Accept': 'text/csv'} 
		});
	});	
	Service.getFileAsXml = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xml/', 
			headers: {'Accept': 'text/xml'} 
		});
	});		
	Service.getFileAsXlsx = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xlsx/', 
			headers: {'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
			responseType: 'blob' 
		});
	});		
	
	Service.getToEdit = safeCall(function (id) {
		return Service.get(resourceUrl + '/' + id );
	});

	Service.get = function (link) {
		return $http.get(link);
	};

	Service.add = safeCall(function (item) {
		return $http.post(resourceUrl, JSON.stringify(item));
	});

	Service.update = function (item) {
		return $http.put(resourceUrl + '/' + item._id, JSON.stringify(item));
	};

	Service.delete = safeCall(function (id) {
		return $http.delete(resourceUrl + '/' + id);
	});

	Service.deleteMany = safeCall(function (ids) {
		var msg = { 
			'className' : 'entidad',
			'ids'		: ids
		};	
		return $http.post(baseApi + '/delete', JSON.stringify(msg));
	});	

	Service.deleteAll = safeCall(function (opts) {
		var msg = { 
			'className' : 'entidad',
			'conditions' : buildMongooseQuery(opts)
		};	
		return $http.post(baseApi + '/deleteAll', JSON.stringify(msg));
	});	

	Service.getByFamiliaId = safeCall(function (familiaId) {
		var query = '/?conditions={"familiaId":"' + familiaId +'"}&sort=-version';
		return $http.get(resourceUrl + query);
	});	

	Service.loadForm = function(formName, diag, keys, defaultValue) {
		var form = getform(formName, diag) || {};

		var res = {};

		for(var i=0; i<keys.length; i++) {
			var key = keys[i];
			res[key] = convertTypesFromString(getQuestion(form, key, defaultValue));
		}
		res.valoracion = formName.valoracion || null;

		return res;
	};

	function convertTypesFromString(value) {
		//Detects booleans encoded as string an returns as booleans 
		if (value === "true") {
			return true;
		}
		if (value === "false") {
			return false;
		}
		return value;
	}

	Service.loadFormAsBoolArray = function (formName, diag, arrayVarName, size, defaultValue) {
		var form = getform(formName, diag) || {};
		var res = {};
		res[arrayVarName] = [];
		var array = res[arrayVarName];

		for(var i=0; i<size; i++) {
			array[i] = toBool(getQuestion(form, 'q'+i, defaultValue));
		}
		res.valoracion = formName.valoracion || null;

		return res;
	};

	Service.loadFormAsNumberArray = function (formName, diag, arrayVarName, size, defaultValue) {
		var form = getform(formName, diag) || {};
		var res = {};
		res[arrayVarName] = [];
		var array = res[arrayVarName];

		for(var i=0; i<size; i++) {
			array[i] = toNumber(getQuestion(form, 'q'+i, defaultValue));
		}
		res.valoracion = formName.valoracion || null;
		return res;
	};

	function toNumber(value) {
		if (value == null) {
			return null; 
		}
		var number = Number(value);
		return number;
	}

	function toBool(value) {
		if (value == null) {
			return value; 
		}
		return (value === "true");
	}

	function getform(formName, diag) {
		for(var i=0; i<diag.formularios.length; i++) {
			var item = diag.formularios[i];
			if (item.tipo === formName) {
				return item;
			}
		}
		return null;
	}
	function getQuestion(form, qName, defaultValue) {
		if (form == null || form.preguntas == null ) {
			return defaultValue;
		}
		for(var i=0; i<form.preguntas.length; i++) {
			var pregunta = form.preguntas[i];
			if (pregunta.clave == qName) {
				if (pregunta.respuesta === undefined) {
					return defaultValue;			
				}
				return pregunta.respuesta;
			}			
		}
		return defaultValue;
	}
	Service.prepareForSave = function(diag, formName, formView, questionPrefix, start, size) {
		var form = getform(formName, diag);
		if (form == null) { 
			form = {};
			diag.formularios.push(form);
		}
		//update form data ---
		form.tipo = formName;
		form.preguntas = [];
		form.valoracion = formView.valoracion;

		for(var i=start; i<(start+size); i++) {
			var pregunta = {
				'clave': questionPrefix+i,
				'respuesta': formView[questionPrefix+i]
			};
			form.preguntas.push(pregunta);
		}
	};

	Service.prepareForSaveArray = function(diag, formName, formView, arrayVarName) {
		var form = getform(formName, diag);
		if (form == null) { 
			form = {};
			diag.formularios.push(form);
		}
		//update form data ---
		form.tipo = formName;
		form.preguntas = [];
		form.valoracion = formView.valoracion;

		var array = formView[arrayVarName];

		for(var i=0; i<array.length; i++) {
			var pregunta = {
				'clave': arrayVarName+i,
				'respuesta': array[i]
			};
			form.preguntas.push(pregunta);
		}
	};

	Service.cerrar = function(diagnosticoId) {
		var payload = {
			'estado': 'Cerrado'
		};
		return $http.put(resourceUrl + '/' + diagnosticoId, JSON.stringify(payload));
	};

	Service.estaCerrado = function(diagnostico) {
		return (diagnostico.estado === 'Cerrado');
	};

	return Service;

}]);
