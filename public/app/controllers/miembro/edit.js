angular.module('myApp').controller('EditMiembroController', ['$scope', '$routeParams', '$location', 'MiembroService', function ($scope, $routeParams, $location, MiembroService) {
	$scope.miembro = {
		familia : null, 
		ciudadano : null, 
		fechaAlta : new Date(0), 
		parentesco : '', 
		fechaBaja : new Date(0), 
		causaBaja : '' 
	
	};
	$scope.dataReceived = false;

	if($location.path() !== '/miembro/add') {
		MiembroService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.miembro = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.save = function () {
		if($location.path() === '/miembro/add') {
			MiembroService.add($scope.miembro).then(function () {
				$location.path('/miembro/list');
			});
		} else {
			MiembroService.update($scope.miembro).then(function () {
				$location.path('/miembro/list');
			});
		}
	};

	$scope.cancel = function () {
		$location.path('/miembro/list');
	};

}]);
