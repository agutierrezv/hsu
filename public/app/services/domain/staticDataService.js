angular.module('myApp').service('StaticDataService', ['$http', '$q', 'UrlService', 'baseApi', 'QueryBuilderService', function ($http, $q, UrlService, baseApi, QueryBuilderService) {

	var StaticDataService = {};

	var resourceUrl;
	var docUrl;
	var docUrlReceived;
	var resourceUrlReceived;

	// Getting the servicio API documentation URL and a promise to know when it's loaded.
	docUrlReceived = UrlService.staticDataUrl.then(function (url) {
		docUrl = url;
	});

	// When the documentation is received, getting the servicios resource URL and a promise to know when it's loaded.
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
		var clause1 = null;
		var clause2 = null;
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
		if (opts.enumType && opts.enumType!=="(todos)") {
			clause1 = buildExactMatch('type', opts.enumType);  
		}
		if (opts.searchText && opts.searchText!=='') {
			//Do a custom like query
			clause2 = buildLikeQuery(opts.searchText);   
		}

		var conditions = andClause(clause1, clause2);

		if (conditions) {
			q += prefix + 'conditions=' + encodeURIComponent(conditions);
			prefix='&';			
		}


		return q;
	}

	function andClause(clause1, clause2) {
		if (clause1 == null) {
			return clause2;
		}
		if (clause2 == null) {
			return clause1;
		}
		return '{"$and":['+ clause1 + ',' + clause2 +']}';
	}
	function orClause(clause1, clause2) {
		if (clause1 == null) {
			return clause2;
		}
		if (clause2 == null) {
			return clause1;
		}
		return '{"$or":['+ clause1 + ',' + clause2 +']}';
	}

	function buildExactMatch(propName, value) {
		return '{"'+ propName +'":"'+ value +'"}';
	}

	function buildLikeQuery(searchText) {
		var res='{"$or":[';
		//add string fields
		var clauses = [];
		var clause = null;

//Process each property

		clause = addStringLike('type', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('key', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('label', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		clause = addStringLike('description', searchText);

		if (clause != null){
			clauses.push(clause);
		}

		var prefix='';
		clauses.forEach(function(item) {
			res+=prefix+item;
			prefix=',';
		});
		res += ']}';

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
		
		clause = addStringLike('type', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('key', searchText);

		if (clause != null){
			clauses.push(clause);
		}
		
		clause = addStringLike('label', searchText);

		if (clause != null) {
			clauses.push(clause);
		}

		clause = addStringLike('description', searchText);

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


	function buildFields() {
		return [
			{name: 'type', type: 'string'},
			{name: 'key', type: 'string'},
			{name: 'label', type: 'string'},
			{name: 'description', type: 'string'},
		];
	}


	//-- Public API -----

	StaticDataService.getCount =  safeCall(function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		opts.count = true;		
		var q = buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});
	
	StaticDataService.getList = safeCall(function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		var q = buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});

	StaticDataService.getListAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl, 
			headers: {'Accept': 'text/csv'} 
		});
	});	

	StaticDataService.getFileAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/csv/', 
			headers: {'Accept': 'text/csv'} 
		});
	});	
	StaticDataService.getFileAsXml = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xml/', 
			headers: {'Accept': 'text/xml'} 
		});
	});		
	StaticDataService.getFileAsXlsx = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xlsx/', 
			headers: {'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
			responseType: 'blob' 
		});
	});		
	
	StaticDataService.getToEdit = safeCall(function (id) {
		return StaticDataService.get(resourceUrl + '/' + id );
	});

	StaticDataService.get = function (link) {
		return $http.get(link);
	};

	StaticDataService.add = safeCall(function (item) {
		return $http.post(resourceUrl, JSON.stringify(item));
	});

	StaticDataService.update = function (item) {
		return $http.put(resourceUrl + '/' + item._id, JSON.stringify(item));
	};

	StaticDataService.delete = safeCall(function (id) {
		return $http.delete(resourceUrl + '/' + id);
	});

	StaticDataService.deleteMany = safeCall(function (ids) {
		var msg = { 
			'className' : 'staticData',
			'ids'		: ids
		};	
		return $http.post(baseApi + '/delete', JSON.stringify(msg));
	});	

	StaticDataService.deleteAll = safeCall(function (opts) {
		var msg = { 
			'className' : 'staticData',
			'conditions' : buildMongooseQuery(opts)
		};	
		return $http.post(baseApi + '/deleteAll', JSON.stringify(msg));
	});	

	StaticDataService.getEnumeration = safeCall(function (typeEnum) {
		var q =  '/?conditions={"type":"' + typeEnum + '"}&sort=label';
		return $http.get(resourceUrl + q);
	});
	StaticDataService.getEnumerations = safeCall(function (enumArray) {
		var q =  '/?sort=type label&select=type key label&conditions={' + 
				  buildOrTextEquals(enumArray, 'type') +
		          '}'; //Get all enumerations (no pagination) - exclude localidad & municipio
		return $http.get(resourceUrl + q);
	});

	function buildOrTextEquals(arrayValues, prop) {
		var res = '"$or":[';
		var prefix ='';
		for(var i=0; i< arrayValues.length; i++) {
			var item = arrayValues[i];
			res += prefix + '{"'+ prop +'":"'+ item +'"}';
			prefix =',';
		}
		res += "]";
		return res;
	}

	StaticDataService.getEnumerationFiltered = safeCall(function (typeEnum, typedText, keyId) {
		if (typedText) {
			var q =  '/?sort=type label&select=type key label&limit=10&conditions={"$and":[{"type":"'+
			           typeEnum +'"},{"label":{"$regex":"'+ 
			           typedText +'","$options":"i"}}]}'; //Get enumeration data filtered limit=10
			return $http.get(resourceUrl + q);			
		}
		else {
			return StaticDataService.getEnumerationItemByKey(typeEnum, keyId);
		}
	});
	
	StaticDataService.localeSortByLabel = function(array) {
		return array.sort(localeCompareByLabel);
	};

	function localeCompareByLabel(a, b) {
		return a.label.localeCompare(b.label, 'es');
	}

	StaticDataService.getEnumerationItemByKey = safeCall(function (typeEnum, key) {
		var resource;
		var q;
		if (typeEnum === 'localidad') {
			//redirect resource
			q =  '/?select=key label&limit=1&conditions={"key":"' + key+ '"}'; //Get enumeration item by key. max = 1
			resource = '/api/localidades';
		}
		else if (typeEnum === 'municipio') {
			//redirect resource
			q =  '/?select=key label&limit=1&conditions={"key":"' + key+ '"}'; //Get enumeration item by key. max = 1
			resource = '/api/municipios';
		}
		else {
			resource = resourceUrl;
			q =  '/?select=type key label&limit=1&conditions={"$and":[{"type":"'+
		           typeEnum +'"},{"key":"' + key+ '"}]}'; //Get enumeration item by key. max = 1
		}
		return $http.get(resource + q);
	});

	StaticDataService.getAvailableEnumerations = safeCall(function() {
		var q =  '/?distinct=type';  //get all types
		return $http.get(resourceUrl + q);
	});

	return StaticDataService;

}]);
