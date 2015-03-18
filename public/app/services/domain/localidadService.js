angular.module('myApp').service('LocalidadService', ['$http', '$q', 'UrlService', 'baseApi', 'QueryBuilderService', function ($http, $q, UrlService, baseApi, QueryBuilderService) {

	var LocalidadService = {};

	var resourceUrl;
	var docUrl;
	var docUrlReceived;
	var resourceUrlReceived;

	var fields = null;

	function buildFields() {
		if (!fields) {
			fields = [
				{name: 'key', type: 'string'},
				{name: 'label', type: 'string'},
				{name: 'description', type: 'string'}
			];
		}
		return fields;
	}

	// Getting the servicio API documentation URL and a promise to know when it's loaded.
	docUrlReceived = UrlService.localidadUrl.then(function (url) {
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

	//-- Public API -----

	LocalidadService.getCount =  safeCall(function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		opts.count = true;		
		var q = QueryBuilderService.buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});
	
	LocalidadService.getList = safeCall(function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		var q = QueryBuilderService.buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	});

	LocalidadService.getListAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl, 
			headers: {'Accept': 'text/csv'} 
		});
	});	

	LocalidadService.getFileAsCsv = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/csv/', 
			headers: {'Accept': 'text/csv'} 
		});
	});	
	LocalidadService.getFileAsXml = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xml/', 
			headers: {'Accept': 'text/xml'} 
		});
	});		
	LocalidadService.getFileAsXlsx = safeCall(function () {
		return $http({
			method: 'GET', 
			url: resourceUrl + '/download/xlsx/', 
			headers: {'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
			responseType: 'blob' 
		});
	});		
	
	LocalidadService.getToEdit = safeCall(function (id) {
		return LocalidadService.get(resourceUrl + '/' + id );
	});

	LocalidadService.get = function (link) {
		return $http.get(link);
	};

	LocalidadService.add = safeCall(function (item) {
		return $http.post(resourceUrl, JSON.stringify(item));
	});

	LocalidadService.update = function (item) {
		return $http.put(resourceUrl + '/' + item._id, JSON.stringify(item));
	};

	LocalidadService.delete = safeCall(function (id) {
		return $http.delete(resourceUrl + '/' + id);
	});

	LocalidadService.deleteMany = safeCall(function (ids) {
		var msg = { 
			'className' : 'localidad',
			'ids'		: ids
		};	
		return $http.post(baseApi + '/delete', JSON.stringify(msg));
	});	

	LocalidadService.deleteAll = safeCall(function (opts) {
		var msg = { 
			'className' : 'localidad',
			'conditions' : buildMongooseQuery(opts)  //todo
		};	
		return $http.post(baseApi + '/deleteAll', JSON.stringify(msg));
	});

	LocalidadService.getItemsFiltered = safeCall(function (typedText, keyId) {
		if (typedText) {
			var q =  '/?sort=label&select=key label&limit=10&conditions='+
			           '{"label":{"$regex":"'+ typedText +'","$options":"i"}}'; //Get data filtered limit=10
			return $http.get(resourceUrl + q);			
		}
		else {
			return LocalidadService.getItemByKey(keyId);
		}
	});
	
	LocalidadService.localeSortByLabel = function(array) {
		return array.sort(localeCompareByLabel);
	};

	function localeCompareByLabel(a, b) {
		return a.label.localeCompare(b.label, 'es');
	}

	LocalidadService.getItemByKey = safeCall(function (keyId) {
		var q =  '/?sort=type label&select=key label&limit=1&conditions='+
		           '{"key":"' + keyId+ '"}'; //Get item by key. max = 1
		return $http.get(resourceUrl + q);
	});

	return LocalidadService;

}]);
