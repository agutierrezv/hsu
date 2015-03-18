angular.module('myApp').filter('sexo', function() {
  return function(input) {
	if (input == null) {
	 return '-';
	}
	if (input == '0' ) {
		return '\u2642 hombre';
	} else if (input == '1') {
		return '\u2640 mujer';
	} else if (input == '2') {
		return 'indeterminado';
	} else {
		return 'desconocido';
	} 
  };
});