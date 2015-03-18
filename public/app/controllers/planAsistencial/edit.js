angular.module('myApp').controller('EditPlanAsistencialController', ['$scope', '$routeParams', '$location', 'PlanAsistencialService', function ($scope, $routeParams, $location, PlanAsistencialService) {
	$scope.planAsistencial = {
		codigo : '', 
		domicilioFamiliar : '', 
		ciudadanoId : '', 
		identificacionCiudadano : '', 
		nombre : '', 
		apellido1 : '', 
		apellido2 : '', 
		fechaApertura : Date.now(), 
		profesionalId : '', 
		profesionalReferencia : '' 
	
	};
	$scope.dataReceived = false;

	if($location.path() !== '/planAsistencial/add') {
		PlanAsistencialService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.planAsistencial = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.save = function () {
		if($location.path() === '/planAsistencial/add') {
			PlanAsistencialService.add($scope.planAsistencial).then(function () {
				$location.path('/planAsistencial/list');
			});
		} else {
			PlanAsistencialService.update($scope.planAsistencial).then(function () {
				$location.path('/planAsistencial/list');
			});
		}
	};

	$scope.cancel = function () {
		$location.path('/planAsistencial/list');
	};

}]);
