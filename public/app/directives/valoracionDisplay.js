angular.module('myApp').directive("valoracionDisplay", [function () {

    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        scope: {
            state: '=ngModel'
        },
        templateUrl: '/app/directives/valoracionDisplay.html',

        link: function compile(scope, element, attrs, controller) {
           
        }
    };
	
}]);
