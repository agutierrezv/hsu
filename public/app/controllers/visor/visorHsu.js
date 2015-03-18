angular.module('myApp').controller('VisorHsuController', ['$scope', '$rootScope', '$location', '$routeParams', 'NavigationService', 'CiudadanoService', 'MiembroService', 'FamiliaService', 'UserErrorService', function ($scope, $rootScope, $location, $routeParams, NavigationService, CiudadanoService, MiembroService, FamiliaService, UserErrorService) {
	
	$scope.usuario = {};
	
	$scope.cambiarFoto = function() {
		NavigationService.push($location.path(), "CambiarFoto", null); //$scope);
		$location.path('/usuario/cambiarFoto/'+ $routeParams.id);
	};
	function cambiarFotoBack() {
		var navItem = NavigationService.pop();
		//$scope = navItem.state;
		var ret = navItem.returnData;
	}

	$scope.documentacion = function() {
		$location.path('/documentacion/' + $routeParams.id);
	};
	
	$scope.gotoUnidadFamiliar = function() {
		if ($scope.usuario.familia) {
			var familiaId = $scope.usuario.familia._id;
			$location.path('/familia/' + familiaId);
		}
		else {
			//No hay familia
			$location.path('/familias/');
		}
	};
	

	function loadData(httpResponse) {
		$scope.usuario = httpResponse.data;
		if ($scope.usuario.familia) {
			$scope.usuario.direccion = FamiliaService.formatDireccion2($scope.usuario.familia, $rootScope);
		}	

		//Carton piedra
		//$scope.usuario.timeline = cartonPiedra.usuario.hsu;

		if ($scope.usuario) {
			$scope.usuario.photoUrl = getPhotoUrl($scope.usuario.fotoId);
		}

		//Load timeline
		CiudadanoService.getTimeLine($routeParams.id)
						.then(loadTimeLine, errorHandler);

	}
	function loadTimeLine(httpData) {
		$scope.usuario.timeline = httpData.data;
	}
	function errorHandler(httpError) {
		$scope.usuario = null;
		$scope.errors = UserErrorService.translateErrors(httpError, "query");
	}
	function getPhotoUrl(photoId) {
		if (photoId == null) {
			return "/images/anon-photo.png";
		}
		return "/api/binaryContent/img/" + photoId;
	}

	function init() {
		
		
		//var personIndex = (parseInt($routeParams.id, 16) - 1) % 4;
		//$scope.usuario = usuarios[personIndex];

		if (NavigationService.isReturnFrom('CambiarFoto')) {
			cambiarFotoBack();
		}

		CiudadanoService.getToEditFamilia($routeParams.id)
						.then(loadData, errorHandler);
	}

	init();
}]);