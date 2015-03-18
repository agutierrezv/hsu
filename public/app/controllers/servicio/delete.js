angular.module('myApp').controller('DeleteServicioController', ['$scope', '$routeParams', '$location', 'ServicioService', function ($scope, $routeParams, $location, ServicioService) {
	$scope.servicio = {};
	$scope.dataReceived = false;

	if($location.path() !== '/servicio/delete') {
		ServicioService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.servicio = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		ServicioService.delete($scope.servicio._id).then(function () {
			$location.path('/servicio/list');
		});
	};

	$scope.cancel = function () {
		$location.path('/servicio/list');
	};

}]);
