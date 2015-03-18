angular.module('myApp').controller('DeleteEntidadController', ['$scope', '$routeParams', '$location', 'EntidadService', function ($scope, $routeParams, $location, EntidadService) {
	$scope.entidad = {};
	$scope.dataReceived = false;

	if($location.path() !== '/entidad/delete') {
		EntidadService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.entidad = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		EntidadService.delete($scope.entidad._id).then(function () {
			$location.path('/entidad/list');
		});
	};

	$scope.cancel = function () {
		$location.path('/entidad/list');
	};

}]);
