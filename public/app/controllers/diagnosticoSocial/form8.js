angular.module('myApp').controller('Form8Controller', ['$http', '$scope', '$routeParams', '$location', '$q', '$timeout', 'NavigationService', 'UserErrorService', 'FamiliaService', 'DiagnosticoSocialService', function ($http, $scope, $routeParams, $location, $q, $timeout, NavigationService, UserErrorService, FamiliaService, DiagnosticoSocialService) {
	$scope.isDirty = false;
	var savingFlag = false;

	$scope.indicadores = 0;
	$scope.readonly = false;

	$scope.familia = null;
	$scope.diagnostico = null;
	$scope.form = null;

	$scope.leyenda = {
		a: 'A',
		d: 'D',
		md: 'MD',		
		i: null
	};

	//navigation
	$scope.navigationTemplate = "/views/partials/navigation.html";

	$scope.canGotoPrevious = function() {
		return true;
	};
	$scope.canGotoNext = function() {
		return true;
	};
	$scope.gotoUp = function() {
		saveIfDirty();
		$location.path('/diagnosticoSocial/version/'+ $scope.diagnostico._id);
	};
	$scope.gotoPrevious = function() {
		saveIfDirty();
		$location.path('/diagnosticoSocial/form7/'+ $scope.diagnostico._id);
	};
	$scope.gotoNext = function() {
		saveIfDirty();
		$location.path('/diagnosticoSocial/form9/'+ $scope.diagnostico._id);
	};
	//end navigation

	function calculate() {
		var f = $scope.form;

		//Adultos
		if (f.q1 === "a1" || 
			f.q1 === "a2" || 
			f.q1 === "a3" ) {
			$scope.form.valoracionAdultos = 'A'; //Adecuado
		}
		else if (f.q1 === "a4") {
			$scope.form.valoracionAdultos = 'D';  //Deficitario
		}
		else if (f.q1 === "a5" || 
				 f.q1 === "a6" || 
			     f.q1 === "a7") {
			$scope.form.valoracionAdultos = 'MD'; //Muy deficitario			
		} 
		else {
			$scope.form.valoracionAdultos = null;						
		}

		//Menores
		if (f.q10 && 
			!f.q11 && !f.q12 && !f.q13 && !f.q14) {
			$scope.form.valoracionMenores = 'A'; //Adecuado
		}
		else if (f.q11 && 
			!f.q10 && !f.q12 && !f.q13 && !f.q14) {
			$scope.form.valoracionMenores = 'D';  //Deficitario
		}
		else if (f.q12 && 
			!f.q10 && !f.q11 && !f.q13 && !f.q14) {
			$scope.form.valoracionMenores = 'D';  //Deficitario
		}
		else if (f.q13 && 
			!f.q10 && !f.q11 && !f.q12 && !f.q14) {
			$scope.form.valoracionMenores = 'D';  //Deficitario
		}
		else if (f.q14 || 
			    (f.q11 && f.q12) ||
			    (f.q11 && f.q13) ||
			    (f.q12 && f.q13) ) {
			$scope.form.valoracionMenores = 'MD'; //Muy deficitario			
		} 
		else if (!f.q10 && !f.q11 && !f.q12 && !f.q13 && !f.q14) {
			$scope.form.valoracionMenores = null; //inconclusivo. sin cumplimentar
		}
		else {
			$scope.form.valoracionMenores = null;						
		}

		//Compuesta -> la peor valoracion
		$scope.form.valoracion = agregarValoracion($scope.form.valoracionAdultos, $scope.form.valoracionMenores); 
		
		$scope.isDirty = true;
		if (lastTimeout) {
			//cancel previous if pending
			$timeout.cancel(lastTimeout);
		}
		lastTimeout = $timeout(periodicSaveState, 3000, true);
	}
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
		DiagnosticoSocialService.prepareForSave($scope.diagnostico, 'f8', $scope.form, 'q', 1, 14);

		DiagnosticoSocialService.update($scope.diagnostico)
			.then(savedOk,
				  savedFailed);
	}

	function savedOk(httpResponse) {
		savingFlag = false;
		$scope.diagnostico = httpResponse.data;
		$scope.isDirty = false;
		$scope.errors = null;
	}
	function savedFailed(httpError) {
		savingFlag = false;
		$scope.isDirty = true;
		$scope.errors = UserErrorService.translateErrors(httpError, "update");
	}

	function init(){
		if ($routeParams.id) {
			DiagnosticoSocialService.getToEdit($routeParams.id)
			.then(loadDiagnostico,
				  errorHandler);
		}
	}

	function loadDiagnostico(httpResponse) {
		$scope.diagnostico = httpResponse.data;
		$scope.readonly = ($scope.diagnostico.estado !== "Abierto");
		FamiliaService.getToEdit($scope.diagnostico.familiaId)
			.then(loadFamilia,
			 	  errorHandler);
		$scope.form = DiagnosticoSocialService.loadForm('f8', $scope.diagnostico, 
			                ['q1', 'q10', 'q11', 'q12', 'q13', 'q14'], null);		

		$scope.$watch('form.q1', function (value) {
	    	calculate();
		});
		$scope.$watch('form.q10', function (value) {
	    	calculate();
		});
		$scope.$watch('form.q11', function (value) {
	    	calculate();
		});
		$scope.$watch('form.q12', function (value) {
	    	calculate();
		});
		$scope.$watch('form.q13', function (value) {
	    	calculate();
		});
		$scope.$watch('form.q14', function (value) {
	    	calculate();
		});
	}
	function errorHandler(httpError) {
		$scope.diagnostico = null;
		$scope.errors = UserErrorService.translateErrors(httpError, "query");
	}

	function loadFamilia(httpResponse) {
		$scope.familia = httpResponse.data;
		$scope.familia.direccion = FamiliaService.formatDireccion($scope.familia);
	}

	function agregarValoracion(v1, v2) {
		//retornar la peor existente
		if (v1 == null) {
			return v2;
		}
		if (v2 == null) {
			return v1;
		}
		if (v1 === "MD" || v2 === "MD") {
			return "MD";
		}
		if (v1 === "D" || v2 === "D") {
			return "D";
		}
		if (v1 === "A" || v2 === "A") {
			return "A";
		}
		return null;
	}

	init();

}]);