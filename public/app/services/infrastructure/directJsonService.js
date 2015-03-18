angular.module('myApp').service('DirectJsonService', ['$http', function ($http) {
	var DirectJsonService = {};

	DirectJsonService.get = function (url) {
		return $http.jsonp(url + '?callback=JSON_CALLBACK');
	};

	return DirectJsonService;
}]);
