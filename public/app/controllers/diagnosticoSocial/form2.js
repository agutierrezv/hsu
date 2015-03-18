angular.module('myApp').controller('Form2Controller', ['$http', '$scope', '$routeParams', '$location', '$q', '$timeout', 'NavigationService', 'FamiliaService', 'DiagnosticoSocialService', 'UserErrorService', function ($http, $scope, $routeParams, $location, $q, $timeout, NavigationService, FamiliaService, DiagnosticoSocialService, UserErrorService) {
	$scope.isDirty = false;
	var savingFlag = false;
	
	$scope.indicadores = 0;
	$scope.readonly = false;


	$scope.familia = null;
	$scope.diagnostico = null;
	$scope.form = {
		'q': [null, null, null, null, null, null, null, null, null, null,
   			null, null, null, null, null, null, null, null, null, null,
   			null, null, null, null, null, null, null, null, null, null,
   			null, null, null, null  //34
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
		$location.path('/diagnosticoSocial/form1/'+ $scope.diagnostico._id);
	};
	$scope.gotoNext = function() {
		saveIfDirty();
		$location.path('/diagnosticoSocial/form3/'+ $scope.diagnostico._id);
	};
	//end navigation

	

	function calculate() {
		var q = $scope.form.q;
		var incompleto = false;
		var indicadores = 0;		

		for(var i in q)
		{	
			var item = q[i];
			if (item == null) {
				incompleto = true;
			}
			else if (item === true) {
				indicadores++;
			}
		}

		//if (incompleto) {
		//	$scope.form.valoracion = null;	//inconcluso
		//}
		//else 
		if (indicadores <=3) {
			$scope.form.valoracion = 'A'; //Adecuado			
		}
		else if (indicadores <=6) {
			$scope.form.valoracion = 'D';  //Deficitario
		}
		else {
			$scope.form.valoracion = 'MD'; //Muy deficitario			
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
		DiagnosticoSocialService.prepareForSaveArray($scope.diagnostico, 'f2', $scope.form, 'q');

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
		$scope.form = DiagnosticoSocialService.loadFormAsBoolArray('f2', $scope.diagnostico, 'q', 34, null);		

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