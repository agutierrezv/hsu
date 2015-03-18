angular.module('myApp').controller('EditFamiliaController', ['$scope', '$routeParams', '$location', 'UserErrorService', 'MunicipioService', 'LocalidadService', 'FamiliaService', function ($scope, $routeParams, $location, UserErrorService, MunicipioService, LocalidadService, FamiliaService) {
	$scope.isEdition = false;
	$scope.isCreation = false;
	$scope.isDeletion = false;
	$scope.isView = false;
	$scope.readOnly = false;
	$scope.familia = {
		codigo : null, 
		nombreFamilia: null,
		codigoCallejero : '', 
		tipoVia : '', 
		nombreVia : '', 
		numeroVia : null, 
		accesorio : '', 
		bloque : '', 
		escalera : '', 
		piso : null, 
		letra : '', 
		codigoPostal : '', 
		localidadIne : '', 
		municipioIne : '', 
		provinciaIne : '', 
		telefono : ''	
	};
	$scope.dataReceived = false;

	$scope.localidadDataProvider = function(inputTyped, keyId, callback) {
 		LocalidadService.getItemsFiltered(inputTyped, keyId).then(function(httpResponse){
        	callback(httpResponse.data);
        });
	};
	$scope.municipioDataProvider= function(inputTyped, keyId, callback) {
 		MunicipioService.getItemsFiltered(inputTyped, keyId).then(function(httpResponse){
        	callback(httpResponse.data);
        });
	};

	$scope.add = function () {
		FamiliaService.add($scope.familia)
		              .then(gotoList, errorHandlerAdd);
	};
	$scope.update = function () {
		FamiliaService.update($scope.familia)
	              	  .then(gotoList, errorHandlerUpdate);
	};
	$scope.delete = function () {
		FamiliaService.delete($scope.familia._id)
		              .then(gotoList, errorHandlerDelete);		
	};

	function errorHandlerAdd(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "add");
	}
	function errorHandlerUpdate(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "update");
	}
	function errorHandlerDelete(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "delete");
	}
	function errorHandlerLoad(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "query");
	}

	function loadData(httpResponse) {
		$scope.familia = httpResponse.data;
		$scope.errors = null;
		$scope.dataReceived = true;
	}

	$scope.cancel = function () {
		gotoList();
	};
	$scope.gotoEdit = function() {
		$location.path('/familias/edit/' + $routeParams.id);		
	};
	$scope.gotoMiembros = function() {
		$location.path('/familias/miembros/' + $routeParams.id);		
	};
	$scope.gotoDelete = function() {
		$location.path('/familias/delete/' + $routeParams.id);		
	};

	function gotoList() {
		$scope.errors = null;
		$location.path('/familias/');		
	}

	function init() {
		$scope.isDeletion = stringContains($location.path(), '/delete/');
		$scope.isView     = stringContains($location.path(), '/view/');
		$scope.readOnly   = $scope.isDeletion || $scope.isView;

		if ($routeParams.id) {
			$scope.isEdition = !$scope.readOnly;
			$scope.isCreation = false;

			FamiliaService.getToEdit($routeParams.id)
			              .then(loadData, errorHandlerLoad);
		} else {
			$scope.isEdition = false;
			$scope.isCreation = true;
			$scope.dataReceived = true;
		}
	}

	function stringContains(text, substring) {
		return text.indexOf(substring) > -1;
	}


	init();

}]);
