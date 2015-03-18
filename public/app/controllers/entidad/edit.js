angular.module('myApp').controller('EditEntidadController', ['$scope', '$routeParams', '$location', 'MunicipioService', 'LocalidadService', 'EntidadService', function ($scope, $routeParams, $location, MunicipioService, LocalidadService, EntidadService) {
	$scope.entidad = {
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
		contacto : '' 
	
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

	if($location.path() !== '/entidad/add') {
		EntidadService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.entidad = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.save = function () {
		if($location.path() === '/entidad/add') {
			EntidadService.add($scope.entidad).then(function () {
				$location.path('/entidad/list');
			});
		} else {
			EntidadService.update($scope.entidad).then(function () {
				$location.path('/entidad/list');
			});
		}
	};

	$scope.cancel = function () {
		$location.path('/entidad/list');
	};

}]);
