angular.module('myApp').controller('EditMunicipioController', ['$scope', '$routeParams', '$location', 'UserErrorService', 'MunicipioService', function ($scope, $routeParams, $location, UserErrorService, MunicipioService) {
	
	function init() {
		$scope.dataItem = {
			key : '', 
			label : null, 
			description : null	
		};
		$scope.dataReceived = false;
		$scope.errors = null;
		$scope.isEdition = ($location.path() !== '/municipio/add');

		if($scope.isEdition) {
			MunicipioService.getToEdit($routeParams.id)
				.then(objectReceived,
					  errorHandler);
		} 
		else {
			$scope.dataReceived = true;
		}
	}

	$scope.save = function () {
		if($scope.isEdition) {
			MunicipioService.update($scope.dataItem)
				.then(gotoList,
					  errorHandler);
		}
		else {
			MunicipioService.add($scope.dataItem)
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
		$location.path('/municipio/');
	}
	function errorHandler(errorObject) {
		$scope.errors = UserErrorService.translateErrors(errorObject, ($scope.isEdition) ? 'edit' : "add");
		$scope.dataReceived = true;
	}

	init();

}]);
