angular.module('myApp').controller('EditLocalidadController', ['$scope', '$routeParams', '$location', 'UserErrorService', 'LocalidadService', function ($scope, $routeParams, $location, UserErrorService, LocalidadService) {
	
	function init() {
		$scope.dataItem = {
			key : '', 
			label : null, 
			description : null	
		};
		$scope.dataReceived = false;
		$scope.errors = null;
		$scope.isEdition = ($location.path() !== '/localidad/add');

		if($scope.isEdition) {
			LocalidadService.getToEdit($routeParams.id)
				.then(objectReceived,
					  errorHandler);
		} 
		else {
			$scope.dataReceived = true;
		}
	}

	$scope.save = function () {
		if($scope.isEdition) {
			LocalidadService.update($scope.dataItem)
				.then(gotoList,
					  errorHandler);
		}
		else {
			LocalidadService.add($scope.dataItem)
				.then(gotoList, 
					  errorHandler);
		} 
	};
	$scope.cancel = function () {
		gotoList();
	};

	function objectReceived(httpResponse) {
		$scope.dataItem = httpResponse.data;
		$scope.errors = null;
		$scope.dataReceived = true;
	}
	function gotoList() {
		$location.path('/localidad/');
	}
	function errorHandler(errorObject) {
		$scope.errors = UserErrorService.translateErrors(errorObject, ($scope.isEdition) ? 'edit' : "add");
		$scope.dataReceived = true;
	}

	init();

}]);
