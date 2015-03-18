angular.module('myApp').controller('ConcertarCitaController', ['$scope', function ($scope) {

	function init() {
		var today = new Date();
		var citaFecha = new Date(today);
		citaFecha.setDate(today.getDate()+7);  //7 dias
	
		$scope.citaDate = citaFecha;
	}

	init();

}]);