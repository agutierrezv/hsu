angular.module('myApp').controller('EditStaticDataController', ['$scope', '$routeParams', '$location', 'UserErrorService', 'StaticDataService', function ($scope, $routeParams, $location, UserErrorService, StaticDataService) {
	
	function init() {
		$scope.dataItem = {
			type : '', 
			key : '', 
			label : null, 
			description : null	
		};
		$scope.dataReceived = false;
		$scope.errors = null;
		$scope.isEdition = ($location.path() !== '/staticData/add');

		if($scope.isEdition) {
			StaticDataService.getToEdit($routeParams.id)
				.then(objectReceived,
					  errorHandler);
		} 
		else {
			$scope.dataReceived = true;
		}
	}

	$scope.save = function () {
		if($scope.isEdition) {
			StaticDataService.update($scope.dataItem)
				.then(gotoList,
					  errorHandler);
		}
		else {
			StaticDataService.add($scope.dataItem)
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
		$location.path('/staticData/');
	}
	function errorHandler(errorObject) {
		$scope.errors = UserErrorService.translateErrors(errorObject, ($scope.isEdition) ? 'edit' : "add");
		$scope.dataReceived = true;
	}

	init();

}]);
