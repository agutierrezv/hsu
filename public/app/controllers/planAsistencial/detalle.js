angular.module('myApp').controller('DetallePlanAsistencialController', ['$scope', '$routeParams', '$location', 'PlanAsistencialService', 'FamiliaService', 'NavigationService', function ($scope, $routeParams, $location, PlanAsistencialService, FamiliaService, NavigationService) {
	$scope.planAsistencial = {};
	$scope.familia = {};
	$scope.dataReceived = false;


	$scope.back = function () {
		$location.path('/pas');
	};

	$scope.seleccionarFamilia = function() {
		//save context
		NavigationService.push($location.path(), "SelectFamilia", null); //$scope);
		$location.path('/familias/select');
		//select familia and back
	};
	function seleccionarFamiliaBack() {
		var navItem = NavigationService.pop();
		//$scope = navItem.state;
		var familia = navItem.returnData;
		$scope.planAsistencial.familia = familia._id;
		$scope.familia = familia;
		
		saveChanges();
	}

	$scope.seleccionarProfesional = function() {
		//save context
		NavigationService.push($location.path(), "SelectProfesional", null); //$scope);
		$location.path('/profesional/select');
		//select profesional and back
	};
	function selecccionarProfessionalBack() {
		var navItem = NavigationService.pop();
		//$scope = navItem.state;
		var ret = navItem.returnData;
		$scope.planAsistencial.profesionalId = ret._id;
		$scope.planAsistencial.profesionalReferencia = ret.nombre + " " + ret.apellido1 + " " + ret.apellido2;
		saveChanges();
	}

	$scope.addPrestacion = function() {
		//save context
		NavigationService.push($location.path(), "SelectServicio", $scope.planAsistencial );
		$location.path('/servicio/select');
		//select and back
	};

	$scope.asignarDirectamente = function(prestacion) {
		prestacion.fechaAsignacion = Date.now();
		prestacion.estado = 'asignado directamente';
		saveChanges();
	};


	$scope.iniciarTramite = function(prestacion) {
		PlanAsistencialService.iniciarTramite($routeParams.id, prestacion._id)
							  .then(loadPas, errorHandler);
	};

	function addPrestacionBack() {
		var navItem = NavigationService.pop();
		$scope.planAsistencial = navItem.state;
		var ret = navItem.returnData;
				
		$scope.planAsistencial.prestaciones.push({
			fechaApertura: Date.now(),
			nombre: ret.descripcion,
			asignacionDirecta: ret.asignacionDirecta,
			fechaAsignacion: null,
			estado : 'no iniciado',
			estadoTramite: null
		});

		saveChanges();

	}

	$scope.cerrarPas = function(pas) {
		$scope.planAsistencial.fechaCierre = Date.now();
		saveChanges();
	};

	$scope.deletePrestacion = function(prestacion) {
		remove($scope.planAsistencial.prestaciones, prestacion);
		saveChanges();
	};

	function remove(arr, item) {
	      for(var i = arr.length; i--;) {
	          if(arr[i] === item) {
	              arr.splice(i, 1);
	          }
	      }
	}

	function saveChanges() {
		PlanAsistencialService.update($scope.planAsistencial)
			.then(function(httpResponse) {
				$scope.planAsistencial = httpResponse.data;
				calcularEstadoPrestaciones($scope.planAsistencial);
			});
	}

	function loadFamilia(httpResponse) {
		$scope.familia = httpResponse.data;
	}
	function errorHandler(httpError) {
	}

	function loadPas() {
		$scope.dataReceived = false;
		PlanAsistencialService.getToEdit($routeParams.id)
			.then(loadedPas, errorHandler);
	}
	function loadedPas(httpResponse) {
		$scope.planAsistencial = httpResponse.data;
		calcularEstadoPrestaciones($scope.planAsistencial);

		if ($scope.planAsistencial.familia) {
			FamiliaService.getToEdit($scope.planAsistencial.familia)
				.then(loadFamilia, errorHandler);
		}
		$scope.dataReceived = true;
	}

	function calcularEstadoPrestaciones(pas) {
		for(var i=0; i< pas.prestaciones.length; i++) {
			var prestacion = pas.prestaciones[i];
			prestacion.estadoCalculado = calcularEstadoPrestacion(prestacion);
		}
	}
	function calcularEstadoPrestacion(prestacion) {
		if (prestacion.fechaResolucion){
			return prestacion.estado + ' el ' + formatFechaFromText(prestacion.fechaResolucion);
		}
		if (prestacion.estado === 'en tramite'){
			return 'en tramite: (' + prestacion.estadoTramite + ')';
		}
		return prestacion.estado;
	}

	function formatFechaFromText(dtext) {
		if (!dtext) {
			return '-';
		}
		var dt = new Date(Date.parse(dtext));

		var df = dt.getDate() + '/' +
			     (dt.getMonth()+1) + '/' + 
			     dt.getFullYear();
		return df;			      
	}

	function init() {
		PlanAsistencialService.getToEdit($routeParams.id)
			.then(function (httpResponse) {
				$scope.planAsistencial = httpResponse.data;
				calcularEstadoPrestaciones($scope.planAsistencial);

				if ($scope.planAsistencial.familia) {
					FamiliaService.getToEdit($scope.planAsistencial.familia)
						.then(loadFamilia, errorHandler);
				}
				$scope.dataReceived = true;

				//Navigate back from selection
				if (NavigationService.isReturnFrom('SelectServicio')) {
					addPrestacionBack();
				}

				if (NavigationService.isReturnFrom('SelectProfesional')) {
					selecccionarProfessionalBack();
				}

				if (NavigationService.isReturnFrom('SelectFamilia')) {
					seleccionarFamiliaBack();
				}
			});
	}

	init();

}]);