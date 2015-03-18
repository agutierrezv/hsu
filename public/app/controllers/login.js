angular.module('myApp').controller('LoginController', ['$scope', '$rootScope', '$cookies', 'AuthService', '$location', function ($scope, $rootScope, $cookies, AuthService, $location) {

	$rootScope.isLogged = false;	
	$rootScope.apikey = null; 

	$scope.roles = [
      //{name:'Ciudadano', key:'CIU'},
      {name:'Trabajador social', key:'TS'},
      {name:'Profesional', key:'PRO'},
      {name:'Administrador', key:'ADM'}
    ];

	$scope.credentials = {
		role : $scope.roles[0],
		username : '',
		userPassword : '',
		errorMessage: null
	};

	
	
	$scope.login = function () {
		var cred = {
			roleKey : $scope.credentials.role.key,
			roleName : $scope.credentials.role.name,
			username : $scope.credentials.username,
			userPassword : $scope.credentials.userPassword
		};

		AuthService.login(cred)
			.then(function (user) {
				$scope.errorMessage = null;
				$rootScope.isLogged = true;
				
				$rootScope.role = $scope.credentials.role;

				$rootScope.user = {
					 'apikey': $scope.credentials.userPassword,
					 'name': getName($scope.credentials)
				};
				$rootScope.userPassword = $scope.credentials.userPassword;

				if ($rootScope.requestedRoute) {
					var route = $rootScope.requestedRoute;
					$rootScope.requestedRoute = null;
					$location.path(route);
				} else {
					$location.path('/');
				}				
			}, function () {
				$rootScope.isLogged = false;		
				$rootScope.apikey = null;
				$rootScope.role = null;
				$rootScope.username = null;

				$scope.errorMessage = "Credenciales invalidas.";
			});
	};
	
	function getName(cred) {
		var key =cred.role.key;
		if (key == 'TS') {
			return 'Nerea Gomez';
		}
		else if  (key == 'PRO') {
			return 'Luz Mondariz';
		}
		else if  (key == 'ADM') {
			return 'Alicia Eneko';
		}
		return 'Sara Gil';
	}

	$scope.init = function() {
		//autologin if cookie
		//console.log("autologin");
		if ($rootScope.justLogout) {
			$rootScope.justLogout = false;
			return; //hack for IE bug on cookies
		}

		if ($cookies.userPassword != null && $cookies.userPassword!='null' && $cookies.userPassword!='.') {
			$scope.credentials.userPassword = $cookies.userPassword;
			$scope.credentials.username = $cookies.username;
			$scope.credentials.role = {
				name: $cookies.roleName,
				key:  $cookies.roleKey
			};
			$scope.login(); //autologin			
		}
	};
	
	$scope.init();
	  
}]);