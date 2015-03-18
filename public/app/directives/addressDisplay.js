angular.module('myApp').directive("addressDisplay", [function () {

    return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
            props: '=addressDisplay',
            ngModel: '=ngModel'
        },
        link: function compile(scope, element, attrs, controller) {
            scope.$watch('ngModel', function (value) {
                if (value == null) {
                    element.html('');
                } else
                {
                    var html = value + 
                      ' <a class="verMapa" target="_blank" href="https://www.google.es/maps/place/' + 
                      value + '"><span class="glyphicon glyphicon-map-marker"></span></a>';                    
                    element.html(html);
                }

            });
        }
    };
	
}]);
