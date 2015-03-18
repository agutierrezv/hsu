angular.module('myApp').service('RecursoService', ['$http', '$q', 'UrlService', 'baseApi', function ($http, $q, UrlService, baseApi) {

	var RecursoService = {};

	var resourceUrl;
	var docUrl;
	var docUrlReceived;
	var resourceUrlReceived;

	// Getting the recurso API documentation URL and a promise to know when it's loaded.
	docUrlReceived = UrlService.recursoUrl.then(function (url) {
		docUrl = url;
	});

	// When the documentation is received, getting the recursos resource URL and a promise to know when it's loaded.
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

		clause = addStringLike('codigo', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('denominacion', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addBooleanLike('esPublico', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('codigoCalejero', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('tipoVia', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('nombreVia', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('numeroVia', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('accesorio', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('bloque', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('escalera', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('piso', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('letra', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('codigoPostal', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('localidadIne', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('municipioIne', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('provinciaIne', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('telefono1', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('telefono2', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('email', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('contacto', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('sector', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('tipologia', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('centroServicio', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('ambitoGeografico', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('numeroPlazas', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('plazasOcupadas', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('plazasDisponibles', searchText);

		if (clause != null){
			clauses.push(clause);
		}


		clause = addNumberLike('plazasReservadas', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('entidadTitular', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('entidadGestora', searchText);

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

	function addStringLike(property, searchValue) {
		if (searchValue == null) {
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
		
		clause = addStringLike('codigo', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('denominacion', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addBooleanLike('esPublico', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('codigoCalejero', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('tipoVia', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('nombreVia', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addNumberLike('numeroVia', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('accesorio', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addNumberLike('bloque', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addNumberLike('escalera', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addNumberLike('piso', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('letra', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('codigoPostal', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('localidadIne', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('municipioIne', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('provinciaIne', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('telefono1', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('telefono2', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('email', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('contacto', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('sector', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('tipologia', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('centroServicio', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('ambitoGeografico', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addNumberLike('numeroPlazas', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addNumberLike('plazasOcupadas', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addNumberLike('plazasDisponibles', searchText);

		if (clause != null) {
			clauses.push(clause);
		}


		clause = addNumberLike('plazasReservadas', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('entidadTitular', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('entidadGestora', searchText);

		if (clause != null) {
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

	RecursoService.getCount =  safeCall(function (opts) {
		opts = opts || {};
		opts.count = true;		
		var q = buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});
	
	RecursoService.getList = safeCall(function (opts) {
		opts = opts || {};
		var q = buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});

	RecursoService.getListAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl, 
			headers: {'Accept': 'text/csv'} 
		});
	});	

	RecursoService.getFileAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/csv/', 
			headers: {'Accept': 'text/csv'} 
		});
	});	
	RecursoService.getFileAsXml = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xml/', 
			headers: {'Accept': 'text/xml'} 
		});
	});		
	RecursoService.getFileAsXlsx = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xlsx/', 
			headers: {'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
			responseType: 'blob' 
		});
	});		
	
	RecursoService.getToEdit = safeCall(function (id) {
		return RecursoService.get(resourceUrl + '/' + id );
	});

	RecursoService.get = function (link) {
		return $http.get(link);
	};

	RecursoService.add = safeCall(function (item) {
		return $http.post(resourceUrl, JSON.stringify(item));
	});

	RecursoService.update = function (item) {
		return $http.put(resourceUrl + '/' + item._id, JSON.stringify(item));
	};

	RecursoService.delete = safeCall(function (id) {
		return $http.delete(resourceUrl + '/' + id);
	});

	RecursoService.deleteMany = safeCall(function (ids) {
		var msg = { 
			'className' : 'recurso',
			'ids'		: ids
		};	
		return $http.post(baseApi + '/delete', JSON.stringify(msg));
	});	

	RecursoService.deleteAll = safeCall(function (opts) {
		var msg = { 
			'className' : 'recurso',
			'conditions' : buildMongooseQuery(opts)
		};	
		return $http.post(baseApi + '/deleteAll', JSON.stringify(msg));
	});	

	return RecursoService;

}]);
