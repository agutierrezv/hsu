angular.module('myApp').controller('CambioFotoCiudadanoController', ['$scope', '$routeParams', '$location', 'NavigationService', 'CiudadanoService', function ($scope, $routeParams, $location, NavigationService, CiudadanoService) {

	function init() {
		$scope.ciudadano = {};
		$scope.dataReceived = false;

		$scope.$watch('photoFile', function(newValue, oldValue) {
			if (newValue == null || newValue === '') {
				return;
			}
			handleFile(newValue);
		});

		loadCiudadano();
	}
	function loadCiudadano() {
		CiudadanoService.getToEdit($routeParams.id)
		.then(dataReceived, 
			  handleError);
	}

	function handleFile(file) {
		try {
			var r = new FileReader();
			r.onload = function(e) { 
				var contents = e.target.result;
				processData($scope.ciudadano, contents, file);
			};
			r.readAsArrayBuffer(file);
		} catch (e) {
		}
	}

	function processData(ciudadano, content, file) {
		CiudadanoService.changePhoto(ciudadano._id, content, file)
		.then(loadCiudadano,
			  handleError);
	}

	function dataReceived (httpResponse) {
		$scope.ciudadano = httpResponse.data;
		$scope.ciudadano.fotoUrl = getPhotoUrl($scope.ciudadano.fotoId);
		$scope.error = null;
		$scope.dataReceived = true;
	}
	function handleError (error) {
		$scope.error = error;
		$scope.dataReceived = true;
	}

	$scope.changePhoto = function () {
		$scope.dataReceived = false;
		CiudadanoService.changePhoto($scope.ciudadano._id, photoContent)
		.then(changePhotoOk, 
			  changePhotoFailed
		);
	};

	function getPhotoUrl(photoId) {
		if (photoId == null) {
			return "/images/anon-photo.png";
		}
		return "/api/binaryContent/img/" + photoId;
	}

	function changePhotoOk (httpResponse) {
		//$scope.ciudadano = httpResponse.data;
		$scope.error = null;
		$scope.dataReceived = true;

		NavigationService.setReturnData(null);
		$location.path(NavigationService.getReturnUrl());
	}
	function changePhotoFailed (error) {
		$scope.error = error;
		$scope.dataReceived = true;
	}

	$scope.cancel = function () {
		NavigationService.setReturnData(null);
		$location.path(NavigationService.getReturnUrl());
	};
	
	$scope.eliminarFoto = function() {
		CiudadanoService.changePhoto($scope.ciudadano._id, null, null)
			.then(loadCiudadano,
				  handleError);
	};

	init();
}]);
