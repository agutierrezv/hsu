angular.module('myApp').service('UrlService', ['baseUrl', 'documentationUrl', '$http', '$rootScope', function (baseUrl, documentationUrl, $http, $rootScope) {
	
	var UrlService = {};	

	$http.defaults.headers.common.apikey = 'hsu01'; //force access to meta-data
	var apiDoc = $http.get(baseUrl + documentationUrl);

	var getApi = function (apiDocumentation, resource) {
		var api;
		if (apiDocumentation !== undefined) {
			api = findApi(apiDocumentation.apis, resource);
		}
		return api ? removeProtocol(apiDocumentation.basePath + api.path) : undefined;		
	};
	
	function findApi(apiArray, resource){
		for(var index in apiArray){
			if (apiArray[index].description.search(resource) != -1){
				return apiArray[index];
			}
		}
		return undefined;
	}

	function removeProtocol(uri) {
		return uri.replace("http://", "//")
		          .replace("https://", "//");
	}


	UrlService.entidadUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'entidades');
	});

	UrlService.recursoUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'recursos');
	});

	UrlService.profesionalUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'profesionales');
	});

	UrlService.ciudadanoUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'ciudadanos');
	});

	UrlService.familiaUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'familias');
	});

	UrlService.miembroUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'miembros');
	});

	UrlService.planAsistencialUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'planesAsistenciales');
	});

	UrlService.geoPointUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'geoPoints');
	});

	UrlService.servicioUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'servicios');
	});

	UrlService.staticDataUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'staticData');
	});
	
	UrlService.localidadUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'localidades');
	});

	UrlService.municipioUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'municipios');
	});

	UrlService.diagnosticoSocialUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'diagnosticoSocial');
	});

	
	return UrlService;

}]);
