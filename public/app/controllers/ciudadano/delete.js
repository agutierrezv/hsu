angular.module('myApp').controller('DeleteCiudadanoController', ['$scope', '$routeParams', '$location', 'CiudadanoService',function ($scope, $routeParams, $location, CiudadanoService) {
	$scope.ciudadano = {};
	$scope.dataReceived = false;

	if($location.path() !== '/usuario/delete') {
		CiudadanoService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.ciudadano = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		CiudadanoService.delete($scope.ciudadano._id).then(function () {
			$location.path('/usuario/list');
		});
	};

	$scope.cancel = function () {
		$location.path('/usuario/list');
	};

}]);
