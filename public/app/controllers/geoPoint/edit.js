angular.module('myApp').controller('EditGeoPointController', ['$scope', '$routeParams', '$location', 'GeoPointService', function ($scope, $routeParams, $location, GeoPointService) {
	$scope.geoPoint = {
		nombre : '', 
		descripcion : '', 
		tipo : '', 
		longitud : 0, 
		latitud : 0, 
		medicion : '', 
		valor : 0, 
		unidad : '' 
	
	};
	$scope.dataReceived = false;

	if($location.path() !== '/geoPoint/add') {
		GeoPointService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.geoPoint = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.save = function () {
		if($location.path() === '/geoPoint/add') {
			GeoPointService.add($scope.geoPoint).then(function () {
				$location.path('/geoPoint/list');
			});
		} else {
			GeoPointService.update($scope.geoPoint).then(function () {
				$location.path('/geoPoint/list');
			});
		}
	};

	$scope.cancel = function () {
		$location.path('/geoPoint/list');
	};

}]);
