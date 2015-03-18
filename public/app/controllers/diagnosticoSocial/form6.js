angular.module('myApp').controller('Form6Controller', ['$http', '$scope', '$routeParams', '$location', '$q', '$timeout', 'NavigationService', 'FamiliaService', 'DiagnosticoSocialService', 'UserErrorService', function ($http, $scope, $routeParams, $location, $q, $timeout, NavigationService, FamiliaService, DiagnosticoSocialService, UserErrorService) {
	$scope.isDirty = false;
	var savingFlag = false;

	$scope.indicadores = 0;
	$scope.readonly = false;

	$scope.familia = null;
	$scope.diagnostico = null;
	$scope.form = {
		'q': [null, null, null, null, null, null, null, null, null, null,
   			null, null, null, null  //14
		]
	};

	$scope.leyenda = {
		a:  'A',
		d:  'D',
		md: 'MD',		
		i:  null
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
		$location.path('/diagnosticoSocial/version/' + $scope.diagnostico._id);
	};
	$scope.gotoPrevious = function() {
		saveIfDirty();
		$location.path('/diagnosticoSocial/form5/' + $scope.diagnostico._id);
	};
	$scope.gotoNext = function() {
		saveIfDirty();
		$location.path('/diagnosticoSocial/form7/' + $scope.diagnostico._id);
	};
	//end navigation


	function calculate() {
		var q = $scope.form.q;
		var incompleto = false;
		
		var miembros = q[0];
		var ingresos = q[1];

		$scope.form.valoracion = tablaValoracion(miembros, ingresos);
		$scope.isDirty = true;
	
		if (lastTimeout) {
			//cancel previous if pending
			$timeout.cancel(lastTimeout);
		}
		lastTimeout = $timeout(periodicSaveState, 3000, true);
	}
	function tablaValoracion(miembros, ingresos) {
		if (miembros == null || miembros < 1 ) {
			return null; //inconclusivo
		}
		if (miembros == 1) {
			return horquillaValoracion(ingresos, 5952.98, 7738.90);
		}		
		else if (miembros == 2) {
			return horquillaValoracion(ingresos, 6786.40, 8572.32);			
		}		
		else if (miembros == 3) {
			return horquillaValoracion(ingresos, 7619.82, 9405.74);			
		}		
		else if (miembros == 4) {
			return horquillaValoracion(ingresos, 8453.24, 10239.16);
		}		
		else if (miembros >= 5) {
			return horquillaValoracion(ingresos, 9286.66, 11072.58);
		}
		else {
			return null;
		}	
	}
	function horquillaValoracion(ingresos, t1, t2) {
		if (ingresos <=t1) {
			return 'MD'; //Muy deficitario 
		}
		else if (ingresos <=t2) {
			return 'D'; //Deficitario
		}
		else {
			return 'A'; //Aceptable
		}
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
		DiagnosticoSocialService.prepareForSaveArray($scope.diagnostico, 'f6', $scope.form, 'q');

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
		$scope.form = DiagnosticoSocialService.loadFormAsNumberArray('f6', $scope.diagnostico, 'q', 2, null);		

		for(var i=0; i < $scope.form.q.length; i++) {
			addWatch('form.q[' + i + ']');
		}
	}
	function errorHandler(httpError) {
		$scope.diagnostico = null;
		UserErrorService.translateErrors(httpError, "query");
	}

	function loadFamilia(httpResponse) {
		$scope.familia = httpResponse.data;
		$scope.familia.direccion = FamiliaService.formatDireccion($scope.familia);
	}

	function addWatch(variableName) {
		$scope.$watch(variableName, function (value) {
	    	calculate();
		});			
	}

	init();

}]);