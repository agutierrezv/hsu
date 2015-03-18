angular.module('myApp').controller('ViewProfesionalController', ['$scope', '$routeParams', '$location', 'ProfesionalService', function ($scope, $routeParams, $location, ProfesionalService) {
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


	$scope.cancel = function () {
		$location.path('/profesional/list');
	};
	$scope.edit = function () {
		$location.path('/profesional/edit/' + $scope.profesional._id );
	};


	function init() {
		ProfesionalService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.profesional = httpResponse.data;
			$scope.dataReceived = true;
		});
	}

	init();

}]);
