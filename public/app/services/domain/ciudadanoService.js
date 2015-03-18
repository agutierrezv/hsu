angular.module('myApp').service('CiudadanoService', ['$http', '$q', 'UrlService', 'baseApi', function ($http, $q, UrlService, baseApi) {

	var CiudadanoService = {};

	var resourceUrl;
	var docUrl;
	var docUrlReceived;
	var resourceUrlReceived;

	// Getting the ciudadano API documentation URL and a promise to know when it's loaded.
	docUrlReceived = UrlService.ciudadanoUrl.then(function (url) {
		docUrl = url;
	});

	// When the documentation is received, getting the ciudadanos resource URL and a promise to know when it's loaded.
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

		clause = addNumberLike('ciudadanoId', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('identificador', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('tipoIdentificador', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('nombre', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('apellido1', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('apellido2', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('sexo', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('estadoCivil', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addBooleanLike('parejaDeHecho', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('provinciaNacimiento', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('paisDeNacimiento', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('nacionalidad', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('ingresosAnuales', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addBooleanLike('empadronamiento', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('causaBaja', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		//clause = addStringLike('fechaBaja', searchText);

		//if (clause != null)
		//	clauses.push(clause);

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

		clause = addBooleanLike('discapacidad', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('gradoDiscapacidad', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('diagnostico', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('valoracionDependencia', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('rae', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('ocupacion', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('situacionHistoriaLaboral', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('annosResidenciaCCAA', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('annosResidenciaMunicipio', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('nivelEstudios', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addNumberLike('tarjetaSanitaria', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('coberturaSanitaria', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('medico', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('centroSalud', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('direccionCentroSalud', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('telefonoCentroSalud', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		

		clause = addStringLike('observaciones', searchText);

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

		if (boolVal == null){ 
			return null;
		}
		return boolVal;
	}


	function buildMongooseQuery(opts) {
		var q = '';
		if (opts.searchText && opts.searchText!=='') {
			var likeQuery = buildMoongooseLikeQuery(opts.searchText);   
			vq = '{' + likeQuery + '}';			
		}
		return q;
	}

	function buildMoongooseLikeQuery(searchText) {
		var res='"$or":[';
		//add string fields
		var clauses = [];
		var clause = null;

		//Process each property
		
				clause = addNumberLike('ciudadanoId', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('identificador', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('tipoIdentificador', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('nombre', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('apellido1', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('apellido2', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('sexo', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('estadoCivil', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addBooleanLike('parejaDeHecho', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('provinciaNacimiento', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('paisDeNacimiento', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('nacionalidad', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addNumberLike('ingresosAnuales', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addBooleanLike('empadronamiento', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		

		
				clause = addStringLike('causaBaja', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('fechaBaja', searchText);
		
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
		
				clause = addBooleanLike('discapacidad', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('gradoDiscapacidad', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('diagnostico', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('valoracionDependencia', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('rae', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('ocupacion', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('situacionHistoriaLaboral', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addNumberLike('annosResidenciaCCAA', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addNumberLike('annosResidenciaMunicipio', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('nivelEstudios', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addNumberLike('tarjetaSanitaria', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('coberturaSanitaria', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('medico', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('centroSalud', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('direccionCentroSalud', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
				clause = addStringLike('telefonoCentroSalud', searchText);
		
				if (clause != null){
					clauses.push(clause);
				}
		
		
				clause = addStringLike('observaciones', searchText);
		
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

	CiudadanoService.getCount =  safeCall(function (opts) {
		opts = opts || {};
		opts.count = true;		
		var q = buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});
	
	CiudadanoService.getList = safeCall(function (opts) {
		opts = opts || {};
		var q = buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});

	CiudadanoService.getListAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl, 
			headers: {'Accept': 'text/csv'} 
		});
	});	

	CiudadanoService.getFileAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/csv/', 
			headers: {'Accept': 'text/csv'} 
		});
	});	
	CiudadanoService.getFileAsXml = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xml/', 
			headers: {'Accept': 'text/xml'} 
		});
	});		
	CiudadanoService.getFileAsXlsx = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xlsx/', 
			headers: {'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
			responseType: 'blob' 
		});
	});		
	
	CiudadanoService.getToEdit = safeCall(function (id) {
		return CiudadanoService.get(resourceUrl + '/' + id);
	});

	CiudadanoService.getToEditFamilia = safeCall(function (id) {
		return CiudadanoService.get(resourceUrl + '/' + id + '?populate=familia' );
	});

	CiudadanoService.get = function (link) {
		return $http.get(link);
	};

	CiudadanoService.add = safeCall(function (item) {
		return $http.post(resourceUrl, JSON.stringify(item));
	});

	CiudadanoService.update = function (item) {
		return $http.put(resourceUrl + '/' + item._id, JSON.stringify(item));
	};

	CiudadanoService.delete = safeCall(function (id) {
		return $http.delete(resourceUrl + '/' + id);
	});

	CiudadanoService.deleteMany = safeCall(function (ids) {
		var msg = { 
			'className' : 'ciudadano',
			'ids'		: ids
		};	
		return $http.post(baseApi + '/delete', JSON.stringify(msg));
	});	

	CiudadanoService.deleteAll = safeCall(function (opts) {
		var msg = { 
			'className' : 'ciudadano',
			'conditions' : buildMongooseQuery(opts)
		};	
		return $http.post(baseApi + '/deleteAll', JSON.stringify(msg));
	});	

	CiudadanoService.changePhoto = safeCall(function (ciudadanoId, content, file) {
		var base64String = (content != null) ? 
		                      btoa(String.fromCharCode.apply(null, new Uint8Array(content)))
		                      : null;
		var msg = { 
			'content'  : base64String,
			'fileName' : (file!=null)? file.name : null,
			'size'     : (file!=null)? file.size : null,
			'mimeType' : (file!=null)? file.type : null
		};	
		return $http.post(resourceUrl + '/changePhoto/' + ciudadanoId, JSON.stringify(msg));
	});	

	CiudadanoService.getTimeLine = safeCall(function (id) {
		var q = '/timeline/'+ id ;
		return $http.get(resourceUrl + q);
	});

	CiudadanoService.lookupCiudadano = safeCall(function (tipoDoc, docNumber) {
		var msg = { 
			'tipoDoc' : tipoDoc,
			'docNumber' : docNumber
		};	
		return $http.post(resourceUrl + '/lookupCiudadano', JSON.stringify(msg));
	});

	return CiudadanoService;

}]);
