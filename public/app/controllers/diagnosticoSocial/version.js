angular.module('myApp').controller('DiagnosticoSocialVersionController', ['$http', '$scope', '$routeParams', '$location', '$q', '$timeout', 'NavigationService', 'UserErrorService', 'FamiliaService', 'ProfesionalService', 'DiagnosticoSocialService', function ($http, $scope, $routeParams, $location, $q, $timeout, NavigationService, UserErrorService, FamiliaService, ProfesionalService, DiagnosticoSocialService) {
	var savingFlag = false;
	$scope.isDirty = false;
	$scope.readonly = true;
	$scope.familia = {
		id: null,
		direccion: null
	};
	$scope.diagnosticoDto = {
	};
	$scope.diagnostico = {
	};

	$scope.seleccionarProfesional = function() {
		NavigationService.push($location.path(), "SelectProfesional", null); 
		$location.path('/profesional/select');
	};
	function selecccionarProfessionalBack() {
		var ret = NavigationService.pop();
		var prof = ret.returnData;
		$scope.profesional = prof;
		$scope.profesionalReferencia = prof.nombre + " " + prof.apellido1 + " " + prof.apellido2;
		$scope.diagnostico.profesional = prof._id;
		saveState();
	}

	$scope.gotoForm1 = function() {
		$location.path('/diagnosticoSocial/form1/'+$scope.diagnostico._id);
	};
	$scope.gotoForm2 = function() {
		$location.path('/diagnosticoSocial/form2/'+$scope.diagnostico._id);
	};
	$scope.gotoForm3 = function() {
		$location.path('/diagnosticoSocial/form3/'+$scope.diagnostico._id);
	};
	$scope.gotoForm4 = function() {
		$location.path('/diagnosticoSocial/form4/'+$scope.diagnostico._id);
	};
	$scope.gotoForm5 = function() {
		$location.path('/diagnosticoSocial/form5/'+$scope.diagnostico._id);
	};
	$scope.gotoForm6 = function() {
		$location.path('/diagnosticoSocial/form6/'+$scope.diagnostico._id);
	};
	$scope.gotoForm7 = function() {
		$location.path('/diagnosticoSocial/form7/'+$scope.diagnostico._id);
	};
	$scope.gotoForm8 = function() {
		$location.path('/diagnosticoSocial/form8/'+$scope.diagnostico._id);
	};
	$scope.gotoForm9 = function() {
		$location.path('/diagnosticoSocial/form9/'+$scope.diagnostico._id);
	};
	$scope.gotoForm10 = function() {
		$location.path('/diagnosticoSocial/form10/'+$scope.diagnostico._id);
	};
	$scope.gotoForm11 = function() {
		$location.path('/diagnosticoSocial/form11/'+$scope.diagnostico._id);
	};

	function errorHandler(httpError) {
		$scope.diagnostico = null;
		UserErrorService.translateErrors(httpError, "query");
	}
	
	$scope.formatDireccion = function (familia) {
		var res = '';
		//{{familia.nombreVia}} nº {{familia.numeroVia}}  {{familia.accesorio}} {{familia.bloque }} {{familia.escalera }} {{familia.piso }} {{familia.letra}}

		if (familia.nombreVia) {
			res += familia.nombreVia;
		}
		if (familia.numeroVia) {
			res += ' nº ' + familia.numeroVia + ', ';
		}
		if (familia.accesorio) {
			res += ' acc. ' + familia.accesorio;
		}
		if (familia.bloque) {
			res += ' bl. ' + familia.bloque;
		}
		if (familia.escalera) {
			res += ' esc. ' + familia.escalera;
		}
		if (familia.piso) {
			res += ' piso ' + familia.piso;
		}
		if (familia.letra) {
			res +=  ' ' + familia.letra;
		}
		return res;
	};


	$scope.estaCerrado = function() {
		return ($scope.diagnostico != null && 
			    $scope.diagnostico.estado === 'Cerrado');
	};

	function loadDiagnostico(httpResponse) {
		$scope.diagnostico = httpResponse.data;
		$scope.diagnosticoDto = adaptDiagnostico(httpResponse.data);
		$scope.diagnostico.valoracion = $scope.diagnosticoDto.valoracion;		
		$scope.isDirty = false;

		if (NavigationService.isReturnFrom('SelectProfesional')) {
			selecccionarProfessionalBack();			
		}

		FamiliaService.getToEdit($scope.diagnostico.familiaId)
		.then(loadFamilia,
			  errorHandler);

		if ($scope.diagnostico.profesional) {
			ProfesionalService.getToEdit($scope.diagnostico.profesional)
				.then(loadProfesional, errorHandler);
		}
	}

	function loadProfesional(httpResponse) {
		$scope.profesional = httpResponse.data;
		$scope.profesionalReferencia = $scope.profesional.nombre + ' ' +
									   $scope.profesional.apellido1 + ' ' + 
									   $scope.profesional.apellido2;
	}
	function adaptDiagnostico(diag) {
		var res = {};
		if (diag == null) {
			return null;
		}
		var startIndex = 0;
		if (diag.formularios) {		
			for(var i=0; i<diag.formularios.length; i++) {
				var form = diag.formularios[i];
				res[form.tipo] = form.valoracion;
			}
			startIndex = diag.formularios.length;
		}
		for(var j= startIndex; j < 11; j++) {
			res['f'+(j+1)] = null;
		}			
		res.estado = diag.estado;
		
		//res.valoracion = diag.valoracion;
		res.valoracion = calcularDiagnostico(res);

		res.version = diag.version;
		res.id = diag._id;
		res.familiaId = diag.familiaId;

		$scope.readonly = (diag.estado !== "Abierto");

		return res;
	}

	function calcularDiagnostico(result) {
		var muyDefCount = 0; 
		var defCount = 0; 
		var incompletas = 0;		
		
		for(var j = 1; j < 12; j++) {
			var value = result['f'+(j)];
			if (value === "MD") {
				muyDefCount++;
			}
			else if (value === "D") {
				defCount++;
			}
			else if (value === null || value === undefined) {
				incompletas++;
			}
		}	

		if (incompletas > 0) {
			return "Incompleto";
		}

		if (7 <= muyDefCount) {
			return "Marginación";
		}	
		else if (1 <= muyDefCount  && muyDefCount <= 6 && result.f11 === "MD") {
			return "Desventaja social";
		}
		else if (2  <= muyDefCount && muyDefCount <= 3 && 
			     ((result.f6 === "MD" && result.f7 === "MD" ) ||			//al menos 2 de f6-f8
 			      (result.f6 === "MD" && result.f8 === "MD" ) || 
 			      (result.f7 === "MD" && result.f8 === "MD" ) 
			     )
			    ) {
			return "Exclusion social";
		}
		else if (1 <= muyDefCount && muyDefCount <= 4 && 
			     (result.f2 === "MD" || result.f3 === "MD" ||  result.f4 === "MD"  ||  result.f5 === "MD" )
			    ) {
			return "Déficit larga duración";
		}
		else if (1 <= defCount && defCount <= 5 ) {
			return "Déficit coyuntural";
		}
		else if (6 <= defCount  ) {
			return "Déficit coyuntural";  //<-pendiente de dar nombre mas especifico
		}
		else if (defCount === 0 && muyDefCount === 0 ) {
			return "Adecuado";
		}

		return "Cálculo inconclusivo";
	}

	$scope.changedObservaciones = function() {
		$scope.isDirty = true;
		if (lastTimeout) {
			//cancel previous if pending
			$timeout.cancel(lastTimeout);
		}
		lastTimeout = $timeout(periodicSaveState, 3000, true);
	};

	var lastTimeout;

	function periodicSaveState() {
		lastTimeout = null;
		saveIfDirty();
	}
	function saveIfDirty() {
		if ($scope.isDirty) {
			saveState();
		}
	}
	function saveState() {
		if (savingFlag) {
			return;
		}
		if ($scope.readonly) {
			return; //do not save
		}
		savingFlag = true; //saving in progress
		//saves state async
		DiagnosticoSocialService.update($scope.diagnostico)
			.then(savedOk,
				  savedFailed);
	}

	function savedOk(httpResponse) {
		savingFlag = false;
		$scope.diagnostico = httpResponse.data;
		$scope.diagnosticoDto = adaptDiagnostico(httpResponse.data);
		$scope.isDirty = false;
		$scope.errors = null;
	}
	function savedFailed(httpError) {
		savingFlag = false;
		$scope.isDirty = true;
		$scope.errors = UserErrorService.translateErrors(httpError, "update");
	}

	function loadFamilia(httpResponse) {
		$scope.familia = httpResponse.data;
		$scope.familia.direccion = $scope.formatDireccion($scope.familia);
	}

	$scope.gotoOtrasVersiones = function()  {
		$location.path('/diagnosticoSocial/familia/' + $scope.familia._id);
	};

	$scope.puedeCerrarse = function() {
		return !$scope.readonly && 
		       ($scope.diagnostico.valoracion != null &&
				$scope.diagnostico.valoracion !== undefined &&
				$scope.diagnostico.valoracion != "Incompleta" && 
				$scope.diagnostico.valoracion != "Inconclusivo"  
			   );
	};
	$scope.cerrar = function() {
		DiagnosticoSocialService.cerrar($scope.diagnostico._id)
			.then(cierreOk, cierreFailed);
	};

	function cierreOk(httpResponse) {
		$scope.diagnostico = adaptDiagnostico(httpResponse.data);
		$scope.errors = null;
	}
	function cierreFailed(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "update");
	}

	function init(){		
		DiagnosticoSocialService.getToEdit($routeParams.id)
		.then(loadDiagnostico, 
			  errorHandler);
	}

	init();

}]);