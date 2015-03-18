angular.module('myApp').controller('DeleteMiembroController', ['$scope', '$routeParams', '$location', 'MiembroService', function ($scope, $routeParams, $location, MiembroService) {
	$scope.miembro = {};
	$scope.dataReceived = false;

	if($location.path() !== '/miembro/delete') {
		MiembroService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.miembro = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		MiembroService.delete($scope.miembro._id).then(function () {
			$location.path('/miembro/list');
		});
	};

	$scope.cancel = function () {
		$location.path('/miembro/list');
	};

}]);