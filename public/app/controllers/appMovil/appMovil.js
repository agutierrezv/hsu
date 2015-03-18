angular.module('myApp').controller('AppMovilIndexController', ['$scope', '$rootScope', '$location', '$routeParams', function ($scope, $rootScope, $location, $routeParams) {

	var images = [
					"agenda00.png",
					"agenda01.png",
					"vsu00.png",
					"vsu01.png",
					"familia01.png",
					"familia02.png",
					"habitabilidad01.png",
					"habitabilidad02.png"	
				];
	$scope.index = 0;

	$scope.image = images[0];

	$scope.setImage = function(index) {
		$scope.index = index;
		refreshImage();
	};

	$scope.prev = function() {
		if ($scope.index === 0) {
			return;
		}
		$scope.index--;
		refreshImage();
	};

	$scope.next = function() {
		if ($scope.index === images.length - 1) {
			return;
		}
		$scope.index++;		
		refreshImage();
	};

	function refreshImage() {
		$scope.image = images[$scope.index % images.length]; //rotate them
	}

}]);