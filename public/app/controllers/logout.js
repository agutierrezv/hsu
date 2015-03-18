angular.module('myApp').controller('LogoutController', ['$scope', '$rootScope', '$cookies', 'AuthService', '$location', function ($scope, $rootScope, $cookies, AuthService, $location) {

	$rootScope.isLogged = false;	
	$rootScope.userPassword = null; 

	$scope.credentials = {
		role : '',
		username : '',
		userPassword : ''
	};
		
	$scope.logout = function () {
		$scope.credentials.role = null;
		$scope.credentials.username = null;
		$scope.credentials.apikey = null;
		$cookies.userPassword = null;
		//$cookies.apikey = null;
		$cookies.username = null;
		$cookies.role = null;
		$rootScope.justLogout = true; //hack for IE bug on cookies
		AuthService.logout('');
		$location.path('/');		
	};
	
	//$scope.logout();
	  
}]);