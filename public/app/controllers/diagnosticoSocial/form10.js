angular.module('myApp').controller('Form10Controller', ['$http', '$scope', '$routeParams', '$location', '$q', '$timeout', 'NavigationService', 'FamiliaService', 'DiagnosticoSocialService', 'UserErrorService', function ($http, $scope, $routeParams, $location, $q, $timeout, NavigationService, FamiliaService, DiagnosticoSocialService, UserErrorService) {
	$scope.isDirty = false;
	var savingFlag = false;

	$scope.indicadores = 0;
	$scope.readonly = false;

	$scope.form = {
		fecha: null,
		familia: null,
		diagnostico: null,
		q: [
			null, null, null, null  //4
		]
	};

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
		$location.path('/diagnosticoSocial/version/' + $scope.diagnostico._id);
	};
	$scope.gotoPrevious = function() {
		saveIfDirty();
		$location.path('/diagnosticoSocial/form9/' + $scope.diagnostico._id);
	};
	$scope.gotoNext = function() {
		saveIfDirty();
		$location.path('/diagnosticoSocial/form11/' + $scope.diagnostico._id);
	};
	//end navigation


	function calculate() {
		var q = $scope.form.q1;

		if (q === "a1" || q === "a2" ) {
			$scope.form.valoracion = 'A'; //Adecuado			
		}
		else if (q === "a3" ) {
			$scope.form.valoracion = 'D';  //Deficitario
		}
		else if (q === "a4" ) {
			$scope.form.valoracion = 'MD'; //Muy deficitario			
		}
		else {
			$scope.form.valoracion = null;	//incloncluso
		} 

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
		DiagnosticoSocialService.prepareForSave($scope.diagnostico, 'f10', $scope.form, 'q', 1, 1);

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

		$scope.form = DiagnosticoSocialService.loadForm('f10', $scope.diagnostico, ['q1'], null);		

		$scope.$watch('form.q1', function (value) {
	    	calculate();
		});
	}
	function errorHandler(httpError) {
		$scope.diagnostico = null;
		UserErrorService.translateErrors(httpError, "query");
	}

	function loadFamilia(httpResponse) {
		$scope.familia = httpResponse.data;
		$scope.familia.direccion = FamiliaService.formatDireccion($scope.familia);
	}

	init();

}]);