angular.module('myApp').controller('DeleteMunicipioController', ['$scope', '$routeParams', '$location', 'UserErrorService', 'MunicipioService', function ($scope, $routeParams, $location, UserErrorService, MunicipioService) {
	$scope.dataItem = {};
	$scope.dataReceived = false;
	$scope.errors = null;

	if($location.path() !== '/municipio/delete') {
		MunicipioService.getToEdit($routeParams.id)
		                 .then(objectReceived,
		                 	   errorHandler);
	} 
	else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		MunicipioService.delete($scope.dataItem._id)
						 .then(gotoList,
				  			   errorHandler);		
	};

	function objectReceived(httpResponse) {
		$scope.dataItem = httpResponse.data;
		$scope.errors = null;
		$scope.dataReceived = true;
	}

	function gotoList() {
		$location.path('/municipio/');
	}
	function errorHandler(errorObject) {
		$scope.errors = UserErrorService.translateErrors(errorObject, 'delete');
		$scope.dataReceived = true;
	}

	$scope.cancel = function () {
		$location.path('/municipio/');
	};

}]);
