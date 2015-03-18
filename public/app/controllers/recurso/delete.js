angular.module('myApp').controller('DeleteRecursoController', ['$scope', '$routeParams', '$location', 'RecursoService', function ($scope, $routeParams, $location, RecursoService) {
	$scope.recurso = {};
	$scope.dataReceived = false;

	if($location.path() !== '/recurso/delete') {
		RecursoService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.recurso = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		RecursoService.delete($scope.recurso._id).then(function () {
			$location.path('/recurso/list');
		});
	};

	$scope.cancel = function () {
		$location.path('/recurso/list');
	};

}]);
