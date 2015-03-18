angular.module('myApp').controller('DeleteStaticDataController', ['$scope', '$routeParams', '$location', 'UserErrorService', 'StaticDataService', function ($scope, $routeParams, $location, UserErrorService, StaticDataService) {
	$scope.dataItem = {};
	$scope.dataReceived = false;
	$scope.errors = null;

	if($location.path() !== '/staticData/delete') {
		StaticDataService.getToEdit($routeParams.id)
		                 .then(objectReceived,
		                 	   errorHandler);
	} 
	else {
		$scope.dataReceived = true;
	}

	$scope.delete = function () {
		StaticDataService.delete($scope.dataItem._id)
						 .then(gotoList,
				  			   errorHandler);		
	};

	function objectReceived(httpResponse) {
		$scope.dataItem = httpResponse.data;
		$scope.errors = null;
		$scope.dataReceived = true;
	}

	function gotoList() {
		$location.path('/staticData/');
	}
	function errorHandler(errorObject) {
		$scope.errors = UserErrorService.translateErrors(errorObject, 'delete');
		$scope.dataReceived = true;
	}

	$scope.cancel = function () {
		$location.path('/staticData/');
	};

}]);
