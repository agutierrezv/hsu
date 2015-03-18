angular.module('myApp').controller('EditCiudadanoController', ['$scope', '$routeParams', '$location', 'UserErrorService', 'CiudadanoService', function ($scope, $routeParams, $location, UserErrorService, CiudadanoService) {
	$scope.ciudadano = {
		ciudadanoId : 0, 
		identificador : '', 
		tipoIdentificador : '', 
		nombre : '', 
		apellido1 : '', 
		apellido2 : '', 
		sexo : '', 
		estadoCivil : '', 
		parejaDeHecho : false, 
		fechaNacimiento : null, 
		provinciaNacimiento : '', 
		paisDeNacimiento : '', 
		nacionalidad : '', 
		ingresosAnuales : 0, 
		empadronamiento : false, 
		fechaEmpadronamiento : null, 
		causaBaja : '', 
		fechaBaja : '', 
		telefono1 : '', 
		telefono2 : '', 
		email : '', 
		discapacidad : false, 
		gradoDiscapacidad : '', 
		diagnostico : '', 
		valoracionDependencia : '', 
		rae : '', 
		ocupacion : '', 
		situacionHistoriaLaboral : '', 
		annosResidenciaCCAA : 0, 
		annosResidenciaMunicipio : 0, 
		nivelEstudios : '', 
		tarjetaSanitaria : 0, 
		coberturaSanitaria : '', 
		medico : '', 
		centroSalud : '', 
		direccionCentroSalud : '', 
		telefonoCentroSalud : '', 
		horarioConsultaCentroSalud : null, 
		observaciones : '' 
	
	};
	$scope.dataReceived = false;

	if($location.path() !== '/usuario/add') {
		CiudadanoService.getToEdit($routeParams.id).then(function (httpResponse) {
			$scope.ciudadano = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.save = function () {
		if($location.path() === '/usuario/add') {
			CiudadanoService.add($scope.ciudadano)
				            .then(gotoList, errorOnAdd);
		} else {
			CiudadanoService.update($scope.ciudadano)
							.then(gotoList, errorOnUpdate);
		}
	};

	function errorOnAdd(httpError) {
		$scope.errorsOnSave = UserErrorService.translateErrors(httpError, "add");
	}
	function errorOnUpdate(httpError) {
		$scope.errorsOnSave = UserErrorService.translateErrors(httpError, "update");
	}

	function gotoList() {
		$location.path('/usuario/list');		
	}

	$scope.checkUniqueId = function() {
		if($location.path() !== '/usuario/add') {
			return; //Only for new enties
		}
		if (!$scope.ciudadano.tipoIdentificador  || 
			!$scope.ciudadano.identificador ) {
			return; //Only with data
		}
		CiudadanoService.lookupCiudadano($scope.ciudadano.tipoIdentificador, $scope.ciudadano.identificador)
						.then(lookupCiudadanoCallback, errorHandler);
	};

	function lookupCiudadanoCallback(httpResponse) {
		var res = httpResponse.data;
		var docLabel = tipoDocToLabel(res.tipoDoc);
		if (res.exists) {
			$scope.errors = ["Existe un usuario con el mismo nº de " + docLabel + "."];
			return;
		}
		else if (res.sugerencia) {
			//recuperar nombre y apellidos
			$scope.ciudadano.nombre = res.sugerencia.nombre;
			$scope.ciudadano.apellido1 = res.sugerencia.apellido1;
			$scope.ciudadano.apellido2 = res.sugerencia.apellido2;
			$scope.errors = null;
			return;
		}
		//es nuevo: nada que sugerir
		$scope.errors = null;
	}

	function tipoDocToLabel(code) {
		if (code === "PS") {
			return "Pasaporte";
		}
		if (code === "DNI") {
			return "DNI";
		}
		if (code === "NIE") {
			return "NIE";
		}
		return code;
	}

	function errorHandler(httpError) {
		$scope.errors = httpError;
	}

	$scope.cancel = function () {
		$location.path('/usuario/list');
	};

}]);
