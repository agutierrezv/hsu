angular.module('myApp').controller('CiudadanoLandingController', ['$scope', '$rootScope', '$location', 'PlanAsistencialService', 'DirectJsonService', function ($scope, $rootScope, $location, PlanAsistencialService, DirectJsonService) {

	$scope.errores = [];
	$scope.errores2 = [];

	$scope.data = {
		nombre: null,
		apellido1: null,
		apellido2: null,
		numPersonas: 1,
		ingresoBruto: null,
		personas: [{
				ordinal: 1,
				edad: null,
				esDiscapacitado: false,
				estaEmbarazada: false,
				esDependiente: false,
				esCuidador: false,
				esDesempleado: false
			}
		],
		tipoDoc: "DNI",
		numDoc: null,
		direccion: null
	};

	$scope.currentPrestacion = null;
	$scope.prestacionesSelecionadas = 0;

	$scope.prestaciones = [];

	$scope.carteraDePrestaciones = [{
			id: 1,
			nombre: "Tarjeta OTA para personas con discapacidad",
			descripcion: "La tarjeta OTA permite moverse de modo gratuito por la ciudad a todos los ciudadanos empadronados en Bilbao que acredeten discapacidad.",
			aplicabilidad: "discapacidad",
			factor: 30
		}, {
			id: 2,
			nombre: "Aparcamiento para las personas con movilidad reducida",
			descripcion: "Este servicio permite emplear las plazas de aparcamiento reservadas para minusvalidos en toda la ciudad.",
			aplicabilidad: "discapacidad",
			factor: 30
		}, {
			id: 3,
			nombre: "Ayudas Económicas a la Rehabilitación de Edificios",
			descripcion: "La ayuda para Rehabilitacion de Edificios estan destinadas a familias cuyo domicilio requiera de reparaciones. Para optar a la ayuda, los ingresos familiares no pueden superar los 20.000 euros bruto a año.",
			aplicabilidad: "economico",
			factor: 20000
		}, {
			id: 4,
			nombre: "Ayudas económicas para la supresión de barreras arquitectónicas en edificios de viviendas",
			descripcion: "La ayudas económicas para la supresión de barreras arquitectónicas en edificios de viviendas se presta a aquellas familas con miembros con discapacidad y sin recursos economicos para aboradarlas.",
			aplicabilidad: "discapacidad",			
			factor: 20000
		}, {
			id: 5,
			nombre: "Información sobre actividades y servicios en los Centros Municipales",
			descripcion: "El ayuntamiento presta información sobre actividades y servicios en los Centros Municipales.",
			aplicabilidad: "general"
		}, {
			id: 6,
			nombre: "Solicitud de tarjeta municipal de transporte (Bilbotrans)",
			descripcion: "Bilbotrans es la tarjeta municipal que permite emplear todos los medios de transporte publicos de Bilbao. Destinada a familias numerosas con poco ingresos economicos.",
			aplicabilidad: "economico",			
			factor: 20000				
		}, {
			id: 7,
			nombre: "Tarjeta europea para personas con discapacidad (estacionamiento)",
			descripcion: "La tarjeta europea para personas con discapacidad proporciona licencia de estacionamiento en lugares urbanos reservados para discapacitados.",
			aplicabilidad: "discapacidad",			
			factor: 30				
		}, {
			id: 8,
			nombre: "Tarjetas de Acceso al Casco Viejo",
			descripcion: "Si su domicilio esta ubicado dentro del casco viejo de Bilbao, la Tarjeta de Acceso al Casco Viejo le acredita como vecino con acceso al mismo.",
			aplicabilidad: "localizacion",			
			factor: "bilbao-centro"				
		}, {
			id: 9,
			nombre: "Prestación económica para ingreso en centros de convalecencia",
			descripcion: "Esta prestación es una ayuda complementaria para paliar los gastos por ingreso en centros de convalecencia.",
			aplicabilidad: "econominca",			
			factor: 23000				
		}, {
			id: 10,
			nombre: "Prestaciones económicas individuales para ingresos en centros de día para personas mayores",
			descripcion: "Esta prestación económica cubre los gastos por ingresos en centros de día para personas mayores.",
			aplicabilidad: "edad",			
			factor: 60			
		}, {
			id: 11,
			nombre: "Prestaciones económicas para ingresos en hogares compartidos",
			descripcion: "Prestaciones económicas para ingresos en hogares compartidos.",
			aplicabilidad: "economico",			
			factor: 20000	
		}, {
			id: 12,
			nombre: "Prestaciones económicas para ingresos en viviendas comunitarias ",
			descripcion: "Prestaciones económicas para ingresos en viviendas comunitarias.",
			aplicabilidad: "economico",			
			factor: 20000	
		}, {
			id: 13,
			nombre: "Servicio de acompañamiento",
			descripcion: "Servicio de acompañamiento",
			aplicabilidad: "dependiente",			
			factor: 1	
		}, {
			id: 14,
			nombre: "Servicio de Ayuda a Domicilio (SAD)",
			descripcion: "Servicio de Ayuda a Domicilio (SAD)",
			aplicabilidad: "dependiente",			
			factor: 1	
		}, {
			id: 15,
			nombre: "Servicios Sociales de Base",
			descripcion: "Servicios Sociales de Base",
			aplicabilidad: "general",			
			factor: null	
		}, {
			id: 16,
			nombre: "Teleasistencia",
			descripcion: "Teleasistencia",
			aplicabilidad: "dependiente",			
			factor: 1	
		}
	];


	$scope.canShowPrestaciones = function() {
		return ($scope.errores.length === 0) && ($scope.prestaciones.length > 0);
	};

	$scope.changeNumPersonas = function(num) {
		if (num == null || isNaN(num) ) {
			$scope.data.numPersonas = null;			
		}

		if (num < 1) {
			num = 1;
			$scope.data.numPersonas = num;
		}
		if (num > 20) {
			num = 20;
			$scope.data.numPersonas = num;
		}

		if ($scope.data.personas.length == null) {
			return;
		}
		while ($scope.data.personas.length < num) {
			$scope.data.personas.push({ edad: null, ordinal: $scope.data.personas.length+1 });
		}
		if ($scope.data.personas.length > num) {
			$scope.data.personas.splice(0, $scope.data.personas.length - num ) ;
		}
	};

	$scope.changeEdad = function(persona) {
		if (persona == null) {
			return;
		}
		if (persona.edad == null || isNaN(persona.edad) ) {
			persona.edad = null;			
		}

		if (persona.edad < 0) {
			persona.edad = 0;
		}
		else if (persona.edad > 120) {
			persona.edad = 120;
		}
			
	};

	$scope.setCurrentPrestacion = function(prestacion) {
		$scope.currentPrestacion = prestacion;
	};


	$scope.selectPrestacion = function(prestacion) {
		$scope.setCurrentPrestacion(prestacion);

		if (prestacion == null) {
			return;
		}
		if (prestacion.selected === undefined) {
			prestacion.selected = true; 	
			$scope.prestacionesSelecionadas += 1;
			return;
		}
		if (prestacion.selected) {
			prestacion.selected = false;
			$scope.prestacionesSelecionadas -= 1;
		}
		else {
			prestacion.selected = true;
			$scope.prestacionesSelecionadas += 1;
		}

	};

	$scope.changeIngreso = function(){
		if ($scope.data.ingresoBruto < 0) {
			$scope.data.ingresoBruto = 0;
		}
		if (isNaN($scope.data.ingresoBruto)) {
			$scope.data.ingresoBruto = 0;			
		}
	};

	$scope.tieneEdadMinima = function(edad) {
		return edad >= 16;
	};

	$scope.enRangoDeEmancipacion = function(edad) {
		return edad >= 16 && edad <= 17;
	};

	$scope.puedeCuidar = function(persona) {
		return $scope.puedeTrabajar(persona) ;
	};
	$scope.puedeTrabajar = function(persona) {
		if (persona.edad >= 18) {
			return true;
		}
		if (persona.edad >= 16 && persona.estaEmancipado) {
			return true;
		}
		return false;
	};

	$scope.getTipoPorEdad = function(persona) {
		if (persona.edad < 16) {
			return "menor";
		}
		if ($scope.enRangoDeEmancipacion(persona.edad)) {
			if (persona.estaEmancipado) {
				return "emancipado";
			}
			return "menor";
		}
		return "mayor de edad";
	};


	$scope.comprobar = function() {
		$scope.currentPrestacion = null;
		$scope.prestacionesSelecionadas = 0;

		if (!datosSonValidos()) { 
			return; 
		}
		filtrarPrestaciones();
		
	};

	function filtrarPrestaciones() {
		$scope.prestaciones = [];
		for(var key in $scope.carteraDePrestaciones) {
			var prestacion = $scope.carteraDePrestaciones[key];
			if (prestacion.aplicabilidad == null) {
				$scope.prestaciones.push(prestacion);
			}
			else if (prestacion.aplicabilidad == 'general') {
				$scope.prestaciones.push(prestacion);
			}
			else if (prestacion.aplicabilidad == 'discapacidad') {
				if (hayDiscacidad()) {
					$scope.prestaciones.push(prestacion);
				}
			}
			else if (prestacion.aplicabilidad == 'economico') { 
				if (hayFactorEconomico(prestacion.factor)) {
					$scope.prestaciones.push(prestacion);
				}
			}
			else if (prestacion.aplicabilidad == 'dependiente') {
				if (hayDependencia() || hayMayorDe(60)) {
					$scope.prestaciones.push(prestacion);
				}
			}
			else if (prestacion.aplicabilidad == 'edad') {
				if (hayMayorDe(60)) {
					$scope.prestaciones.push(prestacion);
				}
			}
			else {
				//incluir resto
				$scope.prestaciones.push(prestacion);
			}
		}
	}

	function hayDiscacidad() {
		for(var index in $scope.data.personas) {
			var item = $scope.data.personas[index];
			if (item.esDiscapacitado){
				return true;
			}
		}
		return false;
	}
	function hayFactorEconomico(factor) {
		return $scope.data.ingresoBruto <= factor;		
	}
	function hayDependencia() {
		for(var index in $scope.data.personas) {
			var item = $scope.data.personas[index];
			if (item.esDependiente || item.esCuidador){
				return true;
			}
		}
		return false;
	}
	function hayMayorDe(edadLimite) {
		for(var index in $scope.data.personas) {
			var item = $scope.data.personas[index];
			if (item.edad >= edadLimite){
				return true;
			}
		}
		return false;
	}


	function datosSonValidos() {
		//clean errors
		while ($scope.errores.length > 0) {
		    $scope.errores.pop();
		}
		for(var key in $scope.data.personas){
			var persona = $scope.data.personas[key];
			persona.hasError  = false;
		}

		//check
		if ($scope.data.ingresoBruto == null) {
			$scope.errores.push({
				msg: "Debe introducir el ingreso anual bruto estimado de la unidad familiar."
			});
		}
		if ($scope.data.ingresoBruto < 0) {
			
			$scope.errores.push({
				msg: "El ingreso anual bruto no puede ser negativo."
			});
		}
		for(var key1 in $scope.data.personas){
			var persona1 = $scope.data.personas[key1];
			if (persona1.edad == null || isNaN(persona1.edad)) {
				$scope.errores.push({
					msg: "Debe introducir la edad para el miembro nº:" + persona1.ordinal
				});
				persona1.hasError = true;
			}
		}

		return $scope.errores;
	}

	$scope.concertarCita = function() {
		if (validarIdentificacion()) {

			var code = 'PAS' + new Date().getMinutes() + '' + new Date().getSeconds();
			var prestacionList = [];

			for(var key in $scope.prestaciones) {
				var prestacion = $scope.prestaciones[key];
				if (prestacion.selected) {
					prestacionList.push(
					{
						nombre: prestacion.nombre,
						fechaApertura: new Date()
					});
				}
			}

			var plan = {
				codigo : code, 
				domicilioFamiliar : $scope.data.direccion, 
				tipoIdentificador : $scope.data.tipoDoc, 
				identificacionCiudadano : $scope.data.numDoc, 
				nombre : $scope.data.nombre || '-', 
				apellido1 : $scope.data.apellido1 || '-', 
				apellido2 : $scope.data.apellido2 || '-', 
				fechaSolicitud : new Date(), 
				familia : null, 
				profesionalId : null, 
				profesionalReferencia : null,
				fechaApertura: Date.now(),
				prestaciones : prestacionList
			};

			PlanAsistencialService.add(plan)
			.then(function() {
				$location.path("/publico/concertarCita");			
			});

		}
	};

	 function validarIdentificacion() {
		while ($scope.errores2.length > 0) {
		    $scope.errores2.pop();
		}
	
		if ($scope.data.tipoDoc == null) {
			$scope.errores2.push({
				msg: "Debe indicar un tipo de documento."
			});
		} 
		if ($scope.data.numDoc == null) {
			$scope.errores2.push({
				msg: "Debe indicar un nº de documento."
			});

		} 
		if ($scope.data.direccion == null) {
			$scope.errores2.push({
				msg: "Debe indicar una dirección postal."
			});
		} 
		return $scope.errores2.length === 0;
	}

	function init() {
		/*
		DirectJsonService.get("/data/tipoVia.json")
			.success(function(data, status, headers, config) {
				$scope.tipoVias = data;
			})
			.error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(headers);
				console.log(config);
			});
		*/
	}
	init();
}]);