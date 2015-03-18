var tristateInputController = function ($scope) {

    $scope.ngModel = null;

    $scope.toggle = function(newValue) {
        if ($scope.readonly) {
            return; //disable selector on readOnly
        }

        $scope.ngModel = newValue;
    };  
};

tristateInputController.$inject = ['$scope'];

angular.module('myApp').directive("tristateInput", [function () {

    return {
        controller: tristateInputController,
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        scope: {
            ngModel: '=ngModel'
        },
        templateUrl: '/app/directives/tristateInput.html',

        link: function compile(scope, element, attrs, controller) {
            scope.$watch('ngModel', function (value) {

                //scope.toggle(value);

            });
        }
    };
	
}]);
