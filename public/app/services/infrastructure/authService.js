angular.module('myApp').factory('AuthService', ['$http', 'Session', function ($http, Session) {

	var authService = {};

	authService.login = function (credentials) {
		return $http
			.post('/webLogin', credentials)
			.then(function (res) {
				Session.create(res.data.id, res.data.user.username, res.data.user.role);
				return res.user;
			});
	};
	
	authService.logout = function (credentials) {
		Session.destroy();
		return $http.post('/webLogout', credentials);
	};

	authService.isAuthenticated = function () {
		return !!Session.userId;
	};

	authService.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
	};

	return authService;
}]);
