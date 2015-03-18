angular.module('myApp').controller('MiembrosFamiliaController', ['$rootScope', '$scope', '$routeParams', '$location', 'UserErrorService', 'NavigationService', 'MiembroService', 'FamiliaService', function ($rootScope, $scope, $routeParams, $location, UserErrorService, NavigationService, MiembroService, FamiliaService) {
	$scope.familia = {};
	$scope.dataReceived = false;

	function errorHandlerLoad(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "query");
	}
	function errorHandler(httpError) {
		$scope.errors = UserErrorService.translateErrors(httpError, "update");
	}

	function loadFamilia() {
		$scope.dataReceived = false;
		FamiliaService.getFamiliaMiembros($routeParams.id)
			          .then(dataLoaded, errorHandlerLoad);
	}
	function dataLoaded(httpResponse) {
		$scope.familia = httpResponse.data.familia;
		$scope.miembrosFamilia = httpResponse.data.miembrosFamilia;
		$scope.familia.direccion = FamiliaService.formatDireccion2($scope.familia, $rootScope);
		$scope.errors = null;
		$scope.dataReceived = true;
	}


	$scope.cancel = function () {
		gotoList();
	};
	$scope.gotoEdit = function() {
		$location.path('/familias/edit/' + $routeParams.id);		
	};
	$scope.addMiembro = function () {
		NavigationService.push($location.path(), "SelectMiembro", null); //$scope);
		$location.path('/usuario/select');
	};
	function selecccionarMiembroBack() {
		var navItem = NavigationService.pop();
		//$scope = navItem.state;
		var usuario = navItem.returnData;
		//añadir miembro a la familia
		//todo (propuesta para seleccionar rol)
		addNewMiembro(usuario);
	}
	function addNewMiembro(usuario) {
		FamiliaService.addMiembro($routeParams.id, usuario._id, null)
			.then(loadFamilia, errorHandlerLoad);
	}


	$scope.removeMiembro = function (miembro) {
		removeFromArrayByKey($scope.miembrosFamilia, miembro, "_id");

		FamiliaService.removeMiembro(miembro.familia, miembro.ciudadano._id)
					  .then(removeMiembroOk, errorHandler);					  
	};

	function removeMiembroOk(data) {		
	}

	function removeFromArrayByKey(collection, target, propName) {
		var targetKey = target[propName];
		for(var i=0; i<collection.length; i++) {
			var item = collection[i];
			if (item[propName] == targetKey) {
				collection.splice(i, 1);
				return;
			}
		}
	}

	$scope.changeParentesco = function (miembro) {
		var data = {
			"_id": miembro._id, 
			"parentesco": miembro.parentesco
		};

		MiembroService.update(data)
					  .then(changeParentescoOk, errorHandler);					  
	};

	function changeParentescoOk(httpResponse) {		
	}


	function gotoList() {
		$scope.errors = null;
		$location.path('/familias/');		
	}

	function init() {
		if (NavigationService.isReturnFrom('SelectMiembro')) {
			selecccionarMiembroBack();
			return;
		}

		if ($routeParams.id) {
			loadFamilia();			
		} else {
			$scope.dataReceived = true;
		}
	}

	init();

}]);
