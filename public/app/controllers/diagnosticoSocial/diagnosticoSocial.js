angular.module('myApp').controller('DiagnosticoSocialController', ['$http', '$scope', '$routeParams', '$location', '$q', 'NavigationService', 'UserErrorService', 'FamiliaService', 'DiagnosticoSocialService', function ($http, $scope, $routeParams, $location, $q, NavigationService, UserErrorService, FamiliaService, DiagnosticoSocialService) {

	$scope.familia = {
		id: null,
		direccion: null
	};

	$scope.seleccionarFamilia = function() {
		//save context
		NavigationService.push($location.path(), "SelectFamilia", null); //$scope);
		$location.path('/familias/select');
		//select familia and back
	};

	function selecccionarFamiliaBack() {
		var navItem = NavigationService.pop();
		var ret = navItem.returnData;
		if (ret != null) {
			$location.path('/diagnosticoSocial/familia/'+ret._id);
			return;
		} 
		else {
			$scope.familia = {
				'id': null,
				'direccion': null
			};
		}
		recuperarDiagnosticosParaFamilia();
	}

	function recuperarDiagnosticosParaFamilia() {
		DiagnosticoSocialService.getByFamiliaId($scope.familia.id)
			.then(loadDiagnosticos,
				  errorHandler);
	}
	function loadDiagnosticos(httpResponse) {
		$scope.diagnosticos = httpResponse.data;
	}
	function errorHandler(httpError) {
		$scope.diagnosticos = null;
		UserErrorService.translateErrors(httpError, "query");
	}
	
	$scope.nuevoDiagnostico = function() {
		DiagnosticoSocialService.add(
			{
				'familiaId': $scope.familia.id,
				'version': new Date(),
				'estado': 'Abierto',
				'valoracion': 'incompleta',
				'formularios': []
			}
		)
		.then(gotoNewDiagnostico, 
	  		  errorHandler);
	};

	function gotoNewDiagnostico(httpResponse) {
		$scope.verDiagnostico(httpResponse.data);
	}

	$scope.verDiagnostico = function(diag) {
		$location.path('/diagnosticoSocial/version/' + diag._id );
	};
	$scope.eliminarDiagnostico = function(diag) {
		DiagnosticoSocialService.delete(diag._id)
			.then(recuperarDiagnosticosParaFamilia, 
  		          errorHandler);
	};

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

	function init(){
		
		if (NavigationService.isReturnFrom('SelectFamilia')) {
			//Navigate back from selection
			selecccionarFamiliaBack();
		}
		else if ($routeParams.id) {
			FamiliaService.getToEdit($routeParams.id)
			.then(loadFamilia,
				  errorHandler);
		}
	}

	function loadFamilia(httpResponse) {
		$scope.familia = httpResponse.data;
		$scope.familia.id = httpResponse.data._id;
		$scope.familia.direccion = $scope.formatDireccion($scope.familia);
		recuperarDiagnosticosParaFamilia();
	}

	init();

}]);