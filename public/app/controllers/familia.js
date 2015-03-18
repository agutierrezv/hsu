angular.module('myApp').controller('FamiliaController', ['$scope', '$rootScope', '$location', '$routeParams', 'NavigationService', 'FamiliaService', 'UserErrorService', function ($scope, $rootScope, $location, $routeParams, NavigationService, FamiliaService, UserErrorService) {

	/*
	familia ={
		id: 123434,
		direccion: "Henao Kalea, nº 22, 1A. Bilbao",
		telefono: "600 500 485",
		miembros: [{ 
				id: 1,
				rol: "principal",
				nombre: "Halima Jawara",
				sexo: "mujer",
				edad: 29
			},
			{ 
				id: 2,
				rol: "pareja",
				nombre: "John Jawara",
				sexo: "hombre",
				edad: 35
			},
			{ 
				id: 3,
				rol: "hija",
				nombre: "Marie Jawara",
				sexo: "mujer",
				edad: 6
			},
			{ 
				id: 4,
				rol: "hijo",
				nombre: "Brad Jawara",
				sexo: "hombre",
				edad: 4
			}
		],
		prestaciones: [{
				id: 123,
				prestacion: "Ayuda familiar",
				descripcion: "Ayuda 1...."
			},
			{
				id: 124,
				prestacion: "Reagrupacion familiar",
				descripcion: "Ayuda 1...."
			}
		],
		hsu: [
				{
					fecha: new Date(2014, 3, 34),
					year: 2014,
					titulo: "Ingreso mínimo de solidaridad",
					descripcion: [
						"Solicitado por el usuario el 21 de mayo de 2013.",
						"Solicitado por los Servicios Sociales Base el 7 de junio de 2013.",
						"Concedido por el Departamento de Políticas y Servicios Sociales."
					],
					estado : "Prestacion extinguida",
					revisiones: [
						{
							fecha: new Date(2014, 5, 14),
							titulo: "Revisión a instancia de parte",
							cuantiaAnterior: 128.00 
						},
						{
							fecha: new Date(2014, 6,8),
							titulo: "Extinción de la prestación",
							cuantiaAnterior: 234.00 
						}
					],
					masInfo: true				
				},
				{
					fecha: new Date(2013, 7, 12),
					year: 2013,
					titulo: "Banco de alimentos",
					descripcion: [
						"Asignación directa."
					]					
				},
				{
					fecha: new Date(2014, 7, 11),
					titulo: "Albergue municipal mínimo de solidaridad",
					descripcion: [
						"Asignación directa."
					]				
				}
			]		
	}; 
	*/

	$scope.visor = function(id) {
		$location.path('/visor/'+id);	
	};


	$scope.documentacion = function(id) {
		$location.path('/documentacion/'+id);
	};

	$scope.addMiembro = function(id) {
	};

	function init() {
		$scope.id = $routeParams.id;
		FamiliaService.getFamiliaMiembros($scope.id)
						.then(loadData, errorHandler);
	}

	function loadData(httpResponse) {
		if (httpResponse && httpResponse.data) {
			$scope.familia = httpResponse.data.familia;
			$scope.miembros = httpResponse.data.miembrosFamilia;
			$scope.familia.direccion = FamiliaService.formatDireccion2($scope.familia, $rootScope);

			FamiliaService.getTimeline($scope.id)
						.then(loadTimeline, errorHandler);
		}
		$scope.errors = null;			
		$scope.dataReceived = true;
	}

	function loadTimeline(httpResponse) {
		$scope.familia.timeline = httpResponse.data;
	}

	function errorHandler(httpError) {
		$scope.familia = null;
		$scope.errors = UserErrorService.translateErrors(httpError, "query");
	}

	init();
}]);