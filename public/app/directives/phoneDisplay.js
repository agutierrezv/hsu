angular.module('myApp').directive("phoneDisplay", [function () {

    var pattern = /(\d|-\(|\)\s)+/gi;
    return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
            props: '=phoneDisplay',
            ngModel: '=ngModel'
        },
        link: function compile(scope, element, attrs, controller) {
            scope.$watch('ngModel', function (value) {
                if (pattern.test(value)) {
                    var html = '<a href="tel:' + value + 
                       '">' + value + '&nbsp;&nbsp; <span class="glyphicon glyphicon-earphone"></span></a>';
                    element.html(html);
                }
                else {
                    element.html(value);
                }
            });

        }
    };
	
}]);
