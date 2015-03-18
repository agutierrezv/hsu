angular.module('myApp').controller('ListMiembroController', ['$http', '$scope', '$location', '$q', '$timeout', 'NavigationService', 'MiembroService', function ($http, $scope, $location, $q, $timeout, NavigationService, MiembroService) {
	$scope.dataList = [];
	$scope.allSelected = false;
	$scope.noneSelected = true;
	$scope.dataReceived = false;
	$scope.pageSize = 12;
	$scope.currentPage = 1;
	$scope.totalItems = 0;
	$scope.searchText = '';

	$scope.add = function () {
		$location.path('/miembro/add');
	};

	$scope.edit = function (obj) {
		$location.path('/miembro/edit/' + obj._id);
	};
	
	$scope.delete = function (obj) {
		$location.path('/miembro/delete/' + obj._id);
	};

	$scope.deleteAll = function() {
		$scope.dataReceived = false;
		
		//todo show modal wit ok/cancel.
		
		MiembroService.deleteAll({ 
			'searchText' : $scope.searchText
		})
		.finally(function(f) {
			$timeout(function(){
				$scope.dataReceived = true;	
				$scope.refresh();			
			}, 500);       
		}); 
	};

	$scope.deleteSelected = function() {
		var ids = [];
		$scope.getSelectedItems().forEach(function(item) {
			ids.push(item._id);
		});
		
		$scope.dataReceived = false;
		
		MiembroService.deleteMany(ids)
		//.catch(function(err) {
		//})
		.finally(function(f) {
			$timeout(function(){
				$scope.dataReceived = true;	
				$scope.refresh();			
			}, 300); 			
		});
	};

	$scope.getAllAreSelected = function () {
		var selectedCount = $scope.getSelectedItems().length;
		return selectedCount == $scope.dataList.length; 
	};

	$scope.getSelectedItems = function() {
		var res = [];
		for(var index in $scope.dataList) {
			var item = $scope.dataList[index];
			if (item._isSelected) {
				res.push(item);
			}
		}
		return res;
	};
	
	$scope.selectItem = function (item, event) {
		item._isSelected = (event.currentTarget.checked);
		$scope.allSelected = $scope.getAllAreSelected();
		$scope.noneSelected = $scope.getSelectedItems().length === 0;
	};

	$scope.selectAll = function (event) {
		var value = (event.currentTarget.checked);
		if (value == null) {
			return; //mixted state
		}
		$scope.allSelected = value;
		$scope.noneSelected = !value;
		$scope.dataList.forEach(function(item) {
			item._isSelected = value;
		});
	};

	$scope.importData = function () {
		NavigationService.push($location.path());
		$location.path('/import/miembro');		
	};

	$scope.exportAsCsv = function () { 
		$scope.dataReceived = false;	
		MiembroService.getFileAsCsv()
		.then(function(httpResponse) {
			sendFile(httpResponse, "miembros.csv", "text/csv");
		})
		.finally(function() {
			$scope.dataReceived = true;
		});
	};
	$scope.exportAsXml = function () { 
		$scope.dataReceived = false;	
		MiembroService.getFileAsXml().then(function(httpResponse) {
			sendFile(httpResponse, "miembros.xml", "text/xml");
		})
		.finally(function() {
			$scope.dataReceived = true;
		});

	};
	$scope.exportAsXlsx = function () {
		$scope.dataReceived = false;	
		MiembroService.getFileAsXlsx().then(function(httpResponse) {
			sendFile(httpResponse, "miembros.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		})
		.finally(function() {
			$scope.dataReceived = true;
		});
	};

	function sendFile(httpResponse, fileName, mime) {
		var data = httpResponse.data;
		var headers = httpResponse.headers();
		var filename = headers["x-filename"] || fileName || "miembros.csv";
		var contentType = headers["content-type"] || mime || "text/csv";
		var url, blob;

		if (navigator.msSaveBlob)
		{
			// Save blob is supported, so get the blob as it's contentType and call save.
			blob = new Blob([data], { type: contentType });
			navigator.msSaveBlob(blob, filename);
		}
		else
		{
			// Get the blob url creator
			var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
			if(urlCreator)
			{
				// Try to use a download link
				var link = document.createElement("a");
				if("download" in link)
				{
					// Prepare a blob URL
					blob = new Blob([data], { type: contentType });
					url = urlCreator.createObjectURL(blob);
					link.setAttribute("href", url);

					// Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
					link.setAttribute("download", filename);

					// Simulate clicking the download link
					var event = document.createEvent('MouseEvents');
					event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
					link.dispatchEvent(event);
				} else {
					// Prepare a blob URL
					// Use application/octet-stream when using window.location to force download
					blob = new Blob([data], { type: octetStreamMime });
					url = urlCreator.createObjectURL(blob);
					window.location = url;
				}
			} else {
				console.log("Not supported");
			}
		}
	}
	
	$scope.loadCurrentPage = function () {
		//$scope.dataReceived = false;
		MiembroService.getList({ 
			'page'     : $scope.currentPage,
			'pageSize' : $scope.pageSize,
			'searchText' : $scope.searchText
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
			$scope.dataReceived = true;
			$scope.$digest();
		});
	};	
	
	$scope.updateRecordCount = function () {
		MiembroService.getCount({ 
			'searchText' : $scope.searchText
		})
		.catch(function(err) {
			if (err) {
				console.error(err);
			}
		})
		.then(function(httpResponse) {
			$scope.totalItems = Number(httpResponse.data);
		});
	};
	
	$scope.clearSearch = function() {
		$scope.searchText = '';
		$scope.refresh();
	};

	$scope.refresh = function () {
		$scope.updateRecordCount();
		$scope.currentPage = 1;
		$scope.loadCurrentPage();
	};

	$scope.refresh();
}]);
