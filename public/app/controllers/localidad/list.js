angular.module('myApp').controller('ListLocalidadController', ['$scope', '$location', 'NavigationService', 'EntityUtilService','LocalidadService', function ($scope, $location, NavigationService, EntityUtilService, LocalidadService) {
	$scope.dataList = [];
	$scope.selectionContext = {
		allSelected:  false,
		noneSelected: true,
	};
	$scope.searchContext = {
		pageSize: 12,
		currentPage: 1,
		searchText: '',
		totalItems: 0,
		isSearching: false	
	};

	$scope.add = function () {
		$location.path('/localidad/add');
	};

	$scope.edit = function (obj) {
		$location.path('/localidad/edit/' + obj._id);
	};
	
	$scope.delete = function (obj) {
		$location.path('/localidad/delete/' + obj._id);
	};

	$scope.deleteAll = function() {
		//todo: show modal wit ok/cancel.
		var searchCriteria = {
			'searchText' : $scope.searchContext.searchText
		};
		return EntityUtilService.deleteAll(LocalidadService, searchCriteria, $scope.refresh);  
	};

	$scope.deleteSelected = function() {
		EntityUtilService.deleteSelected(LocalidadService, $scope.dataList, $scope.refresh);  
	};

	//selection -----
	$scope.getSelectedItems = function() {
		return EntityUtilService.getSelectedItems($scope.dataList);  
	};
	$scope.selectItem = function (item, event) {
		return EntityUtilService.selectItem($scope.dataList, $scope.selectionContext, item, event);  
	};
	$scope.selectAll = function (event) {
		return EntityUtilService.selectAll($scope.dataList, $scope.selectionContext, event);  
	};

	// import / export ----
	$scope.importData = function () {
		NavigationService.push($location.path());
		$location.path('/import/localidad');		
	};
	$scope.exportAs = function (format) { 
		EntityUtilService.exportAsFormat(format, LocalidadService, "localidades", $scope);
	};
	
	$scope.loadCurrentPage = function () {
		$scope.dataReceived = false;
		$scope.searchContext.isSearching = true;
		LocalidadService.getList({ 
				'page'       : $scope.searchContext.currentPage,
				'pageSize'   : $scope.searchContext.pageSize,
				'searchText' : $scope.searchContext.searchText
			})
			.then(onLoadData)
			.catch(onError)
			.finally(onLoadDataFinally);
	};	

	function onLoadData(httpResponse) {
		$scope.dataList = httpResponse.data;
	} 
	function onError(err) {
		if (err) {
			console.error(err);
		}
	}
	function onLoadDataFinally() {
		$scope.searchContext.isSearching = false;
		$scope.dataReceived = true;
		$scope.$digest();
	} 
	
	$scope.updateRecordCount = function () {
		$scope.searchContext.totalItems = null;	
		LocalidadService.getCount({ 
			'searchText' : $scope.searchContext.searchText
		})
		.catch(onError)
		.then(function(httpResponse) {
			$scope.searchContext.totalItems = Number(httpResponse.data);
		});
	};

	$scope.refresh = function (searchContext) {
		$scope.updateRecordCount();
		$scope.searchContext.currentPage = 1;
		$scope.loadCurrentPage();
	};

	function init() {
		$scope.refresh();
	}

	init();
}]);
