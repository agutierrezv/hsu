angular.module('myApp').controller('EditServicioController', ['$scope', '$routeParams', '$location', 'ServicioService', function ($scope, $routeParams, $location, ServicioService) {
	$scope.servicio = {
		codigo : '', 
		descripcion : '', 
		colectivo : '', 
		caracteristicas : '', 
		solicitudDocumentacion : '', 
		plazoInicio : new Date(0), 
		plazoFin : new Date(0), 
		lugarDePresentacion : '', 
		contacto : '', 
		instanciaDeParte : '',
		asignacionDirecta: false	
	};
	$scope.dataReceived = false;

	if($location.path() !== '/servicio/add') {
		ServicioService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.servicio = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.save = function () {
		if($location.path() === '/servicio/add') {
			ServicioService.add($scope.servicio).then(function () {
				$location.path('/servicio/list');
			});
		} else {
			ServicioService.update($scope.servicio).then(function () {
				$location.path('/servicio/list');
			});
		}
	};

	$scope.cancel = function () {
		$location.path('/servicio/list');
	};

}]);
