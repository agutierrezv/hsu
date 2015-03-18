angular.module('myApp').directive("emailDisplay", [function () {

    return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
            props: '=emailDisplay',
            ngModel: '=ngModel'
        },
        link: function compile(scope, element, attrs, controller) {
            scope.$watch('ngModel', function (value) {
                if (value !== "" || value != null) {
                    var html = '<a href="mailto:' + value + 
                       '">' + value + ' &nbsp;&nbsp; <span class="glyphicon glyphicon-envelope"></span></a>';
                    element.html(html);
                }
                else {
                    element.html(value);
                }
            });

        }
    };
	
}]);
