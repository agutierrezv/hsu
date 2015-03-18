angular.module('myApp').controller('DocumentacionController', ['$scope', '$rootScope', '$location', '$routeParams' , function ($scope, $rootScope, $location, $routeParams) {

	$scope.model = {
		ciudadanoId: 1,
		name : "Halima Jawara",
		documents :  [
			{
				selected: true,
				name: 'Informe de habitabilidad',
				url: '/images/docs/doc0001.jpg',
				date: new Date(2014, 4, 2)				
			},
			{
				name: 'Documento 2',
				url: '/images/docs/doc0002.jpg',				
				date: new Date(2014, 5, 1)				
			},
			{
				name: 'Documento 3',
				url: '/images/docs/doc0003.jpg',				
				date: new Date(2014, 3, 5)				
			},
			{
				name: 'Documento 4',
				url: '/images/docs/doc0004.jpg',				
				date: new Date(2014, 5, 4)				
			},
			{
				name: 'Documento 5',
				url: '/images/docs/doc0005.jpg',				
				date: new Date(2014, 2, 3)				
			}
		]
	};

	$scope.selectDocument = function(doc) {
		if ($scope.currentDoc != null) {
			$scope.currentDoc.selected = false;
		}
		if (doc != null) {
			doc.selected = true;
		}
		$scope.currentDoc = doc;
	};

	$scope.getHumanDate = function(date) {
		if (date == null) {
			return '';
		}
		var now = new Date();
		var d1Y = date.getFullYear();	
        var d1M = date.getMonth();
        var d2Y = now.getFullYear();
        var d2M = now.getMonth();

        var months = (d2M+12*d2Y)-(d1M+12*d1Y);

		return months + " meses";
	};

	function init() {
		$scope.currentDoc = $scope.model.documents[0];
		$scope.selectDocument($scope.currentDoc);
	}


	init();
}]);