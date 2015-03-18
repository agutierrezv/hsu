angular.module('myApp').controller('DeleteProfesionalController', ['$scope', '$routeParams', '$location', 'ProfesionalService', function ($scope, $routeParams, $location, ProfesionalService) {
	$scope.profesional = {};
	$scope.dataReceived = false;

	if($location.path() !== '/profesional/delete') {
		ProfesionalService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.profesional = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		ProfesionalService.delete($scope.profesional._id).then(function () {
			$location.path('/profesional/list');
		});
	};

	$scope.cancel = function () {
		$location.path('/profesional/list');
	};

}]);
