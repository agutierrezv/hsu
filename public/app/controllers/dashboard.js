angular.module('myApp').controller('DashboardController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {

	$scope.gotoCiudadanos = function() {
		$location.path('/usuarios');
	};
	$scope.gotoFamilias = function() {
		$location.path('/familias');
	};
	$scope.gotoProfesionales = function() {
		$location.path('/profesionales');
	};
	$scope.gotoPas = function() {
		$location.path('/pas');
	};
	$scope.gotoPrestaciones = function() {
		$location.path('/servicios');
	};
	$scope.gotoInformes = function() {
		$location.path('/informes');
	};
	$scope.gotoRecursos = function() {
		$location.path('/recursos');
	};
	$scope.gotoAdmin = function() {
		$location.path('/admin');
	};
	$scope.gotoAppMovil = function() {
		$location.path('/appMovil');
	};
	$scope.gotoDiagnosticoSocial = function() {
		$location.path('/diagnosticoSocial');
	};
}]);