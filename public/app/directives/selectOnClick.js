angular.module('myApp').directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
            element.on('focus', function () {
                this.select();
            });
        }
    };
});