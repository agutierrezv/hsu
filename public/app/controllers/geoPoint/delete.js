angular.module('myApp').controller('DeleteGeoPointController', ['$scope', '$routeParams', '$location', 'GeoPointService', function ($scope, $routeParams, $location, GeoPointService) {
	$scope.geoPoint = {};
	$scope.dataReceived = false;

	if($location.path() !== '/geoPoint/delete') {
		GeoPointService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.geoPoint = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		GeoPointService.delete($scope.geoPoint._id).then(function () {
			$location.path('/geoPoint/list');
		});
	};

	$scope.cancel = function () {
		$location.path('/geoPoint/list');
	};
}]);
