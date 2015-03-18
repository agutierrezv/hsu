angular.module('myApp').controller('SelectLocalidadController', ['$http', '$scope', '$location', '$q', '$timeout', 'NavigationService', 'LocalidadService', function ($http, $scope, $location, $q, $timeout, NavigationService, LocalidadService) {
	$scope.dataList = [];
	$scope.allSelected = false;
	$scope.noneSelected = true;
	$scope.dataReceived = false;

	//search component -----
	$scope.searchContext = {
		pageSize: 12,
		currentPage: 1,
		searchText: '',
		totalItems: 0,
		isSearching: false	
	};


	$scope.select = function(retData) {
		NavigationService.setReturnData(retData);
		$location.path(NavigationService.getReturnUrl());
	};

	$scope.loadCurrentPage = function () {
		$scope.dataReceived = false;
		$scope.searchContext.isSearching = true;
		StaticDataService.getList({ 
			'page'     : $scope.searchContext.currentPage,
			'pageSize' : $scope.searchContext.pageSize,
			'searchText' : $scope.searchContext.searchText
		})
		.then(function(httpResponse) {
			$scope.dataList = httpResponse.data;
		})
		.catch(function(err) {
			if (err) {
				console.error(err);
			}
		})
		.finally(function() {
			$scope.searchContext.isSearching = false;
			$scope.dataReceived = true;
			$scope.$digest();
		});
	};	
	
	$scope.updateRecordCount = function () {
		LocalidadService.getCount({ 
			'searchText' : $scope.searchContext.searchText
		})
		.catch(function(err) {
			if (err) {
				console.error(err);
			}
		})
		.then(function(httpResponse) {
			$scope.searchContext.totalItems = Number(httpResponse.data);
		});
	};
	
	$scope.refresh = function (searchContext) {
		$scope.updateRecordCount();
		$scope.searchContext.currentPage = 1;
		$scope.loadCurrentPage();
	};

	$scope.refresh();
}]);
