angular.module('myApp').controller('AsignarPlanAsistencialController', ['$scope', '$routeParams', '$location', 'PlanAsistencialService', 'NavigationService', function ($scope, $routeParams, $location, PlanAsistencialService, NavigationService) {
	$scope.planAsistencial = {};
	$scope.dataReceived = false;

	PlanAsistencialService.getToEdit($routeParams.id)
		.then(function (httpResponse) {
			$scope.planAsistencial = httpResponse.data;
			$scope.dataReceived = true;
		});

	$scope.cancel = function () {
		$location.path('/pas');
	};

	$scope.seleccionarProfesional = function() {
		//save context
		NavigationService.push($location.path(), "SelectProfesional", null); //$scope);
		$location.path('/profesional/select');
		//select profesional and back
	};
	function selecccionarProfessionalBack() {
		var navItem = NavigationService.pop();
		//$scope = navItem.state;
		var ret = navItem.returnData;
		$scope.profesionalId = ret._id;
		$scope.profesionalReferencia = ret.nombre + " " + ret.apellido1 + " " + ret.apellido2;
	}

	$scope.execute = function () {
		$scope.planAsistencial.profesionalId = $scope.profesionalId;
		$scope.planAsistencial.profesionalReferencia = $scope.profesionalReferencia;

		PlanAsistencialService.update(
				$scope.planAsistencial
			)
			.then(function () {
				$location.path('/pas');
			});
	};


	function init(){
		//Navigate back from selection
		if (NavigationService.isReturnFrom('SelectProfesional')) {
			selecccionarProfessionalBack();
		}
	}

	init();

}]);
