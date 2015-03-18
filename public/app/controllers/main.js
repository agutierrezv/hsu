angular.module('myApp').controller('MainController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {

	$scope.serviceUriBase = $location.protocol() + '://' + $location.host() + ":" + $location.port();	

}]);