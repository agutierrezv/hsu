angular.module('myApp').controller('EditProfesionalController', ['$scope', '$routeParams', '$location', 'ProfesionalService', function ($scope, $routeParams, $location, ProfesionalService) {
	$scope.profesional = {
		codigo : '', 
		tipoIndentificador : '', 
		identificador : '', 
		prefijo : '', 
		nombre : '', 
		apellido1 : '', 
		apellido2 : '', 
		telefono : '', 
		email : '', 
		tipologia : '', 
		sector : '', 
		esPublico : false, 
		acreditado : false, 
		ambitoGeografico : '', 
		nivel : '', 
		perfil : '' 
	
	};
	$scope.dataReceived = false;

	if($location.path() !== '/profesional/add') {
		ProfesionalService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.profesional = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.save = function () {
		if($location.path() === '/profesional/add') {
			ProfesionalService.add($scope.profesional).then(function () {
				$location.path('/profesional/list');
			});
		} else {
			ProfesionalService.update($scope.profesional).then(function () {
				$location.path('/profesional/list');
			});
		}
	};

	$scope.cancel = function () {
		$location.path('/profesional/list');
	};

}]);
