angular.module('myApp', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngMap', 'ngAnimate', 'autocomplete'])

	//for production only
	/*
	.config(['$compileProvider', function ($compileProvider) {
		$compileProvider.debugInfoEnabled(false);
	}]);
	*/


	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/',	 						{ templateUrl: 'views/dashboard.html', controller: 'DashboardController' })
			.when('/dashboard',	 				{ templateUrl: 'views/dashboard.html', controller: 'DashboardController' })
			.when('/admin',	                   	{ templateUrl: 'views/main.html',  controller: 'MainController' })
			.when('/login',                   	{ templateUrl: 'views/login.html',  controller: 'LoginController' })
			.when('/logout',                    { templateUrl: 'views/logout.html', controller: 'LogoutController' })
			.when('/import/:class', 			{ templateUrl: 'views/import.html', controller: 'ImportController' })

			.when('/publico', 					{ templateUrl: 'views/publico/ciudadanoLanding.html', controller: 'CiudadanoLandingController' })
			.when('/publico/concertarCita',     { templateUrl: 'views/publico/concertarCita.html', controller: 'ConcertarCitaController' })
			.when('/publico/no-encontrado',     { templateUrl: 'views/publico/404.html' })

			.when('/visor/:id', 		        { templateUrl: 'views/visor/visorHsu.html', controller: 'VisorHsuController' })
			.when('/documentacion/:id', 		{ templateUrl: 'views/documentacion/documentacion.html', controller: 'DocumentacionController' })
			.when('/familia/:id', 				{ templateUrl: 'views/familia.html', controller: 'FamiliaController' })

			.when('/usuarios', 					{ templateUrl: 'views/ciudadano/list.html',   controller: 'ListCiudadanoController' })
			.when('/profesionales', 			{ templateUrl: 'views/profesional/list.html',   controller: 'ListProfesionalController' })
			.when('/pas', 						{ templateUrl: 'views/planAsistencial/list.html',   controller: 'ListPlanAsistencialController' })

			.when('/pas/detalle/:id', 			{ templateUrl: 'views/planAsistencial/detalle.html',   controller: 'DetallePlanAsistencialController' })
			.when('/pas/asignar/:id', 			{ templateUrl: 'views/planAsistencial/asignar.html',   controller: 'AsignarPlanAsistencialController' })

			.when('/servicios', 				{ templateUrl: 'views/servicio/list.html',   controller: 'ListServicioController' })
			.when('/recursos', 					{ templateUrl: 'views/recurso/list.html',   controller: 'ListRecursoController' })
			.when('/informes', 					{ templateUrl: 'views/informes/informes.html', controller: 'InformesController' })
			.when('/informes/:informe', 		{ templateUrl: 'views/informes/informe.html', controller: 'InformeController' })
			.when('/informes/geo/:informe', 	{ templateUrl: 'views/informes/informeGeo.html', controller: 'InformeGeoController' })
			.when('/informes/geo2/b',	 		{ templateUrl: 'views/informes/informeGeo2.html', controller: 'InformeGeoController' })

			.when('/appMovil', 					{ templateUrl: 'views/appMovil/index.html', controller: 'AppMovilIndexController' })

			.when('/entidad/list',		 { templateUrl: 'views/entidad/list.html',   controller: 'ListEntidadController' })
			.when('/entidad/add',        { templateUrl: 'views/entidad/edit.html',   controller: 'EditEntidadController' })
			.when('/entidad/edit/:id', 	 { templateUrl: 'views/entidad/edit.html',   controller: 'EditEntidadController' })
			.when('/entidad/delete/:id', { templateUrl: 'views/entidad/delete.html', controller: 'DeleteEntidadController' })

			.when('/recurso/list',		 { templateUrl: 'views/recurso/list.html',   controller: 'ListRecursoController' })
			.when('/recurso/add',        { templateUrl: 'views/recurso/edit.html',   controller: 'EditRecursoController' })
			.when('/recurso/edit/:id', 	 { templateUrl: 'views/recurso/edit.html',   controller: 'EditRecursoController' })
			.when('/recurso/delete/:id', { templateUrl: 'views/recurso/delete.html', controller: 'DeleteRecursoController' })

			.when('/profesional/detalle/:id', { templateUrl: 'views/profesional/view.html', controller: 'ViewProfesionalController' })
			.when('/profesional/list',		 { templateUrl: 'views/profesional/list.html',   controller: 'ListProfesionalController' })
			.when('/profesional/add',        { templateUrl: 'views/profesional/edit.html',   controller: 'EditProfesionalController' })
			.when('/profesional/edit/:id', 	 { templateUrl: 'views/profesional/edit.html',   controller: 'EditProfesionalController' })
			.when('/profesional/delete/:id', { templateUrl: 'views/profesional/delete.html', controller: 'DeleteProfesionalController' })
			.when('/profesional/select',     { templateUrl: 'views/profesional/select.html', controller: 'SelectProfesionalController' })

			.when('/usuario/list',		 { templateUrl: 'views/ciudadano/list.html',   controller: 'ListCiudadanoController' })
			.when('/usuario/select', 	 { templateUrl: 'views/ciudadano/select.html', controller: 'SelectCiudadanoController' })
			.when('/usuario/add',        { templateUrl: 'views/ciudadano/edit.html',   controller: 'EditCiudadanoController' })
			.when('/usuario/edit/:id', 	 { templateUrl: 'views/ciudadano/edit.html',   controller: 'EditCiudadanoController' })
			.when('/usuario/delete/:id', { templateUrl: 'views/ciudadano/delete.html', controller: 'DeleteCiudadanoController' })
			.when('/usuario/cambiarFoto/:id', { templateUrl: 'views/ciudadano/cambiarFoto.html', controller: 'CambioFotoCiudadanoController' })

			.when('/familias/',  	 	    { templateUrl: 'views/familia/list.html',   controller: 'ListFamiliaController' })
			.when('/familias/add',          { templateUrl: 'views/familia/edit.html',   controller: 'EditFamiliaController' })
			.when('/familias/edit/:id',     { templateUrl: 'views/familia/edit.html',   controller: 'EditFamiliaController' })
			.when('/familias/view/:id',     { templateUrl: 'views/familia/edit.html',   controller: 'EditFamiliaController' })
			.when('/familias/delete/:id',   { templateUrl: 'views/familia/edit.html',   controller: 'EditFamiliaController' })
			.when('/familias/select',	    { templateUrl: 'views/familia/select.html', controller: 'SelectFamiliaController' })
			.when('/familias/miembros/:id', { templateUrl: 'views/familia/miembros.html', controller: 'MiembrosFamiliaController' })

			.when('/miembro/list',		 { templateUrl: 'views/miembro/list.html',   controller: 'ListMiembroController' })
			.when('/miembro/add',        { templateUrl: 'views/miembro/edit.html',   controller: 'EditMiembroController' })
			.when('/miembro/edit/:id', 	 { templateUrl: 'views/miembro/edit.html',   controller: 'EditMiembroController' })
			.when('/miembro/delete/:id', { templateUrl: 'views/miembro/delete.html', controller: 'DeleteMiembroController' })

			.when('/planAsistencial/list',		 { templateUrl: 'views/planAsistencial/list.html',   controller: 'ListPlanAsistencialController' })
			.when('/planAsistencial/add',        { templateUrl: 'views/planAsistencial/edit.html',   controller: 'EditPlanAsistencialController' })
			.when('/planAsistencial/edit/:id', 	 { templateUrl: 'views/planAsistencial/edit.html',   controller: 'EditPlanAsistencialController' })
			.when('/planAsistencial/delete/:id', { templateUrl: 'views/planAsistencial/delete.html', controller: 'DeletePlanAsistencialController' })

			.when('/geoPoint/list',		 { templateUrl: 'views/geoPoint/list.html',   controller: 'ListGeoPointController' })
			.when('/geoPoint/add',        { templateUrl: 'views/geoPoint/edit.html',   controller: 'EditGeoPointController' })
			.when('/geoPoint/edit/:id', 	 { templateUrl: 'views/geoPoint/edit.html',   controller: 'EditGeoPointController' })
			.when('/geoPoint/delete/:id', { templateUrl: 'views/geoPoint/delete.html', controller: 'DeleteGeoPointController' })

			.when('/servicio/list',		 { templateUrl: 'views/servicio/list.html',   controller: 'ListServicioController' })
			.when('/servicio/add',        { templateUrl: 'views/servicio/edit.html',   controller: 'EditServicioController' })
			.when('/servicio/edit/:id', 	 { templateUrl: 'views/servicio/edit.html',   controller: 'EditServicioController' })
			.when('/servicio/delete/:id', { templateUrl: 'views/servicio/delete.html', controller: 'DeleteServicioController' })
			.when('/servicio/select', 	  { templateUrl: 'views/servicio/select.html', controller: 'SelectServicioController' })

			.when('/diagnosticoSocial/',	        { templateUrl: 'views/diagnosticoSocial/diagnosticoSocial.html', controller: 'DiagnosticoSocialController' })
			.when('/diagnosticoSocial/familia/:id',	{ templateUrl: 'views/diagnosticoSocial/diagnosticoSocial.html', controller: 'DiagnosticoSocialController' })
			.when('/diagnosticoSocial/version/:id', { templateUrl: 'views/diagnosticoSocial/version.html',           controller: 'DiagnosticoSocialVersionController' })
			.when('/diagnosticoSocial/form1/:id',	{ templateUrl: 'views/diagnosticoSocial/form1.html', controller: 'Form1Controller' })
			.when('/diagnosticoSocial/form2/:id',	{ templateUrl: 'views/diagnosticoSocial/form2.html', controller: 'Form2Controller' })
			.when('/diagnosticoSocial/form3/:id',	{ templateUrl: 'views/diagnosticoSocial/form3.html', controller: 'Form3Controller' })
			.when('/diagnosticoSocial/form4/:id',	{ templateUrl: 'views/diagnosticoSocial/form4.html', controller: 'Form4Controller' })
			.when('/diagnosticoSocial/form5/:id',	{ templateUrl: 'views/diagnosticoSocial/form5.html', controller: 'Form5Controller' })
			.when('/diagnosticoSocial/form6/:id',	{ templateUrl: 'views/diagnosticoSocial/form6.html', controller: 'Form6Controller' })
			.when('/diagnosticoSocial/form7/:id',	{ templateUrl: 'views/diagnosticoSocial/form7.html', controller: 'Form7Controller' })
			.when('/diagnosticoSocial/form8/:id',	{ templateUrl: 'views/diagnosticoSocial/form8.html', controller: 'Form8Controller' })
			.when('/diagnosticoSocial/form9/:id',	{ templateUrl: 'views/diagnosticoSocial/form9.html', controller: 'Form9Controller' })
			.when('/diagnosticoSocial/form10/:id',	{ templateUrl: 'views/diagnosticoSocial/form10.html', controller: 'Form10Controller' })
			.when('/diagnosticoSocial/form11/:id',	{ templateUrl: 'views/diagnosticoSocial/form11.html', controller: 'Form11Controller' })

			.when('/staticData/',		 	{ templateUrl: 'views/staticData/list.html',   controller: 'ListStaticDataController' })
			.when('/staticData/add',        { templateUrl: 'views/staticData/edit.html',   controller: 'EditStaticDataController' })
			.when('/staticData/edit/:id', 	{ templateUrl: 'views/staticData/edit.html',   controller: 'EditStaticDataController' })
			.when('/staticData/delete/:id', { templateUrl: 'views/staticData/delete.html', controller: 'DeleteStaticDataController' })
			.when('/staticData/select', 	{ templateUrl: 'views/staticData/select.html', controller: 'SelectStaticDataController' })

			.when('/localidad/',		 	{ templateUrl: 'views/localidad/list.html',   controller: 'ListLocalidadController' })
			.when('/localidad/add',         { templateUrl: 'views/localidad/edit.html',   controller: 'EditLocalidadController' })
			.when('/localidad/edit/:id', 	{ templateUrl: 'views/localidad/edit.html',   controller: 'EditLocalidadController' })
			.when('/localidad/delete/:id',  { templateUrl: 'views/localidad/delete.html', controller: 'DeleteLocalidadController' })
			.when('/localidad/select',    	{ templateUrl: 'views/localidad/select.html', controller: 'SelectLocalidadController' })

			.when('/municipio/',		 	{ templateUrl: 'views/municipio/list.html',   controller: 'ListMunicipioController' })
			.when('/municipio/add',         { templateUrl: 'views/municipio/edit.html',   controller: 'EditMunicipioController' })
			.when('/municipio/edit/:id', 	{ templateUrl: 'views/municipio/edit.html',   controller: 'EditMunicipioController' })
			.when('/municipio/delete/:id',  { templateUrl: 'views/municipio/delete.html', controller: 'DeleteMunicipioController' })
			.when('/municipio/select',    	{ templateUrl: 'views/municipio/select.html', controller: 'SelectMunicipioController' })

			.otherwise({ redirectTo: '/publico/no-encontrado' });
	}])

/*
	.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
	  GoogleMapApi.configure({
	    key: 'AIzaSyD5yDJnJH5ex5xkdzlv61iJJcoKt-RRcGA',
	    v: '3.17',
	    libraries: 'weather,geometry,visualization'
	  });
	}])
*/

	.constant('AUTH_EVENTS', {
	  loginSuccess: 'auth-login-success',
	  loginFailed: 'auth-login-failed',
	  logoutSuccess: 'auth-logout-success',
	  sessionTimeout: 'auth-session-timeout',
	  notAuthenticated: 'auth-not-authenticated',
	  notAuthorized: 'auth-not-authorized'
	})

	.constant('USER_ROLES', {
	  admin: 'admin'
	})

	.run(['$rootScope', '$location', 'StaticDataService', function($rootScope, $location, StaticDataService) {

		// register listener to watch route changes
		$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		  if ( $rootScope.isLogged !== true  ) {
			if ( next.templateUrl == "views/login.html" ||
 				 next.$$route.originalPath.slice(0,8) == "/publico"
 				 ) {
			  // already going to #login, no redirect needed
			} else {
			  // not going to #login, we should redirect now (and store current ruoute for later redirect)
			  $rootScope.requestedRoute = $location.path();
			  $location.path( "/login" );
			}
		  }         
		});

		//Init static data  ------------------
		function getByType(type, collection) {
			var res = [];
			collection.forEach(function(item) {
				if (item.type == type) {
					res.push(item);
				}
			});
			return localeSort(res);
		}
		function localeSort(collection) {
			return collection.sort(localeComparisonByLabel);
		}
		function localeComparisonByLabel(a, b) {
			return a.label.localeCompare(b.label, 'es'); //compare for locale: es
		}

		$rootScope.global = {};
		$rootScope.cache = {};

		StaticDataService.getEnumerations([
			'tipoVia',
			'provincias-es',
			'tipoIdentificador',
			'sexo',
			'estadoCivil',
			'pais',
			'causaBaja',
			'valoracionDependencia',
			'rae',
			'ocupacion',
			'nivelEstudios',
			'coberturaSanitaria',
			'parentesco',
			'ambitoGeografico',
			'centroServicio',
			'sector',
			'colectivo',
			'publicoPrivado'
			]).then(function (httpResponse) {
			
			$rootScope.global.tipoVias = 				getByType('tipoVia', httpResponse.data);
			$rootScope.global.provincias = 				getByType('provincias-es', httpResponse.data);
			$rootScope.global.tipoIdentificadores = 	getByType('tipoIdentificador', httpResponse.data);
			$rootScope.global.sexo = 					getByType('sexo', httpResponse.data);
			$rootScope.global.estadosCiviles = 			getByType('estadoCivil', httpResponse.data);
			$rootScope.global.paises = 					getByType('pais', httpResponse.data);
			$rootScope.global.causasBaja = 				getByType('causaBaja', httpResponse.data);
			$rootScope.global.valoracionesDependencia = getByType('valoracionDependencia', httpResponse.data);
			$rootScope.global.rae = 					getByType('rae', httpResponse.data);
			$rootScope.global.ocupaciones = 			getByType('ocupacion', httpResponse.data);
			$rootScope.global.nivelesEstudios = 		getByType('nivelEstudios', httpResponse.data);
			$rootScope.global.coberturasSanitarias = 	getByType('coberturaSanitaria', httpResponse.data);
			$rootScope.global.parentescos = 			getByType('parentesco', httpResponse.data);
			$rootScope.global.ambitosGeograficos = 		getByType('ambitoGeografico', httpResponse.data);
			$rootScope.global.centrosServicios = 		getByType('centroServicio', httpResponse.data);
			$rootScope.global.sectores = 				getByType('sector', httpResponse.data);
			$rootScope.global.colectivos = 				getByType('colectivo', httpResponse.data);
			$rootScope.global.publicosPrivados = 		getByType('publicoPrivado', httpResponse.data);
		});
		//End Init static data  ------------------
	}]);


var context = '/api';
var apiDocs = '/documentation';
var baseUrl = '';
var documentationUrl = context + apiDocs;

angular.module('myApp').value('baseUrl', baseUrl);
angular.module('myApp').value('documentationUrl', documentationUrl);
angular.module('myApp').value('baseApi', context);
