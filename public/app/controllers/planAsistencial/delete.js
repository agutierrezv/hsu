angular.module('myApp').controller('DeletePlanAsistencialController', ['$scope', '$routeParams', '$location', 'PlanAsistencialService', function ($scope, $routeParams, $location, PlanAsistencialService) {
	$scope.planAsistencial = {};
	$scope.dataReceived = false;

	if($location.path() !== '/planAsistencial/delete') {
		PlanAsistencialService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.planAsistencial = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		PlanAsistencialService.delete($scope.planAsistencial._id).then(function () {
			$location.path('/planAsistencial/list');
		});
	};

	$scope.cancel = function () {
		$location.path('/planAsistencial/list');
	};

}]);