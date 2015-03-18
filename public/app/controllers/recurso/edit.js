angular.module('myApp').controller('EditRecursoController', ['$scope', '$routeParams', '$location', 'RecursoService', 'LocalidadService', 'MunicipioService', function ($scope, $routeParams, $location, RecursoService,LocalidadService,MunicipioService) {
	$scope.recurso = {
		codigo : '', 
		denominacion : '', 
		esPublico : false, 
		codigoCalejero : '', 
		tipoVia : '', 
		nombreVia : '', 
		numeroVia : 0, 
		accesorio : '', 
		bloque : 0, 
		escalera : 0, 
		piso : 0, 
		letra : '', 
		codigoPostal : '', 
		localidadIne : '', 
		municipioIne : '', 
		provinciaIne : '', 
		telefono1 : '', 
		telefono2 : '', 
		email : '', 
		contacto : '', 
		sector : '', 
		tipologia : '', 
		centroServicio : '', 
		ambitoGeografico : '', 
		numeroPlazas : 0, 
		plazasOcupadas : 0, 
		plazasDisponibles : 0, 
		costeDisponibilidad : 0, 
		plazasReservadas : 0, 
		entidadTitular : '', 
		entidadGestora : '' 
	
	};
	$scope.dataReceived = false;

	$scope.localidadDataProvider = function(inputTyped, keyId, callback) {
 		LocalidadService.getItemsFiltered(inputTyped, keyId).then(function(httpResponse){
        	callback(httpResponse.data);
        });
	};

	$scope.municipioDataProvider= function(inputTyped, keyId, callback) {
 		MunicipioService.getItemsFiltered(inputTyped, keyId).then(function(httpResponse){
        	callback(httpResponse.data);
        });
	};

	if($location.path() !== '/recurso/add') {
		RecursoService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.recurso = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.save = function () {
		if($location.path() === '/recurso/add') {
			RecursoService.add($scope.recurso).then(function () {
				$location.path('/recurso/list');
			});
		} else {
			RecursoService.update($scope.recurso).then(function () {
				$location.path('/recurso/list');
			});
		}
	};

	$scope.cancel = function () {
		$location.path('/recurso/list');
	};

}]);
