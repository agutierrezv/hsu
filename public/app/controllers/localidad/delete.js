angular.module('myApp').controller('DeleteLocalidadController', ['$scope', '$routeParams', '$location', 'UserErrorService', 'LocalidadService', function ($scope, $routeParams, $location, UserErrorService, LocalidadService) {
	$scope.dataItem = {};
	$scope.dataReceived = false;
	$scope.errors = null;

	if($location.path() !== '/localidad/delete') {
		LocalidadService.getToEdit($routeParams.id)
		                 .then(objectReceived,
		                 	   errorHandler);
	} 
	else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		LocalidadService.delete($scope.dataItem._id)
						 .then(gotoList,
				  			   errorHandler);		
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
		$scope.errors = UserErrorService.translateErrors(errorObject, 'delete');
		$scope.dataReceived = true;
	}

	$scope.cancel = function () {
		$location.path('/localidad/');
	};

}]);
