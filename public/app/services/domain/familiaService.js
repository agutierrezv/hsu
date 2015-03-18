angular.module('myApp').service('FamiliaService', ['$http', '$q', 'UrlService', 'baseApi', function ($http, $q, UrlService, baseApi) {

	var FamiliaService = {};

	var resourceUrl;
	var docUrl;
	var docUrlReceived;
	var resourceUrlReceived;

	// Getting the familia API documentation URL and a promise to know when it's loaded.
	docUrlReceived = UrlService.familiaUrl.then(function (url) {
		docUrl = url;
	});

	// When the documentation is received, getting the familias resource URL and a promise to know when it's loaded.
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

		clause = addNumberLike('codigo', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('nombreFamilia', searchText);
		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('codigoCallejero', searchText);
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

		clause = addNumberLike('codigoPostal', searchText);

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
		
			clause = addNumberLike('codigo', searchText);
	
			if (clause != null){
				clauses.push(clause);
			}
	
			clause = addStringLike('nombreFamilia', searchText);
			if (clause != null){
				clauses.push(clause);
			}

			clause = addStringLike('codigoCallejero', searchText);
	
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
	
			clause = addNumberLike('codigoPostal', searchText);
	
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

	FamiliaService.getCount =  safeCall(function (opts) {
		opts = opts || {};
		opts.count = true;		
		var q = buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});
	
	FamiliaService.getList = safeCall(function (opts) {
		opts = opts || {};
		var q = buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});

	FamiliaService.getListAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl, 
			headers: {'Accept': 'text/csv'} 
		});
	});	

	FamiliaService.getFileAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/csv/', 
			headers: {'Accept': 'text/csv'} 
		});
	});	
	FamiliaService.getFileAsXml = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xml/', 
			headers: {'Accept': 'text/xml'} 
		});
	});		
	FamiliaService.getFileAsXlsx = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xlsx/', 
			headers: {'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
			responseType: 'blob' 
		});
	});		
	
	FamiliaService.getToEdit = safeCall(function (id) {
		return FamiliaService.get(resourceUrl + '/' + id );
	});

	FamiliaService.get = function (link) {
		return $http.get(link);
	};

	FamiliaService.add = safeCall(function (item) {
		return $http.post(resourceUrl, JSON.stringify(item));
	});

	FamiliaService.update = function (item) {
		return $http.put(resourceUrl + '/' + item._id, JSON.stringify(item));
	};

	FamiliaService.delete = safeCall(function (id) {
		return $http.delete(resourceUrl + '/' + id);
	});

	FamiliaService.deleteMany = safeCall(function (ids) {
		var msg = { 
			'className' : 'familia',
			'ids'		: ids
		};	
		return $http.post(baseApi + '/delete', JSON.stringify(msg));
	});	

	FamiliaService.deleteAll = safeCall(function (opts) {
		var msg = { 
			'className' : 'familia',
			'conditions' : buildMongooseQuery(opts)
		};	
		return $http.post(baseApi + '/deleteAll', JSON.stringify(msg));
	});	


	FamiliaService.formatDireccion2 = function (familia, rootScope) {
		var res = '';
		if (rootScope && rootScope.global && rootScope.global.tipoVias) {
			var candidate = locateLabelForKey(rootScope.global.tipoVias, familia.tipoVia);
			res += candidate || familia.tipoVia;
		} else {
			res += familia.tipoVia;
		}
		return res + ' ' + FamiliaService.formatDireccion(familia);
	};

	function locateLabelForKey(col, key) {
		for(var i=0; i<col.length; i++) {
			var item = col[i];
			if (item.key === key) {
				return item.label;
			}
		}
		return null;
	}
	
	FamiliaService.formatDireccion = function (familia) {
		var res = '';
		//{{familia.nombreVia}} nº {{familia.numeroVia}}  {{familia.accesorio}} {{familia.bloque }} {{familia.escalera }} {{familia.piso }} {{familia.letra}}

		if (familia.nombreVia) {
			res += familia.nombreVia;
		}
		if (familia.numeroVia) {
			res += ' nº ' + familia.numeroVia + ', ';
		}
		if (familia.accesorio) {
			res += ' acc. ' + familia.accesorio;
		}
		if (familia.bloque) {
			res += ' bl. ' + familia.bloque;
		}
		if (familia.escalera) {
			res += ' esc. ' + familia.escalera;
		}
		if (familia.piso) {
			res += ' piso ' + familia.piso;
		}
		if (familia.letra) {
			res +=  ' ' + familia.letra;
		}
		return res;
	};

	FamiliaService.getFamiliaByCodigo = safeCall(function (codigoFamilia) {
		var q = '/?conditions={"codigo":"'+ codigoFamilia +'"}';
		return $http.get(resourceUrl + q);
	});

	FamiliaService.getFamiliaById = safeCall(function (id, populate) {
		var q = '/?conditions={"_id":"'+ id +'"}';
		if (populate) {
			q +="&populate="+populate;
		}
		return $http.get(resourceUrl + q);
	});

	FamiliaService.getFamiliaMiembros = safeCall(function (id) {
		var q = '/familiaMiembros/'+ id ;
		return $http.get(resourceUrl + q);
	});

	FamiliaService.addMiembro = safeCall(function (familiaId, ciudadanoId, parentesco) {
		var msg = {
			'familiaId': familiaId,
			'ciudadanoId': ciudadanoId,
			'parentesco': parentesco
		};
		return $http.post(resourceUrl+'/addMiembro', JSON.stringify(msg));
	});	
	FamiliaService.removeMiembro = safeCall(function (familiaId, ciudadanoId) {
		var msg = {
			'familiaId': familiaId,
			'ciudadanoId': ciudadanoId
		};
		return $http.post(resourceUrl+'/removeMiembro', JSON.stringify(msg));
	});	

	FamiliaService.getTimeline = safeCall(function (id) {
		var q = '/timeline/'+ id ;
		return $http.get(resourceUrl + q);
	});

	return FamiliaService;

}]);
