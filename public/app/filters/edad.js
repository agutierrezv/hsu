angular.module('myApp').filter('edad', function() {
	return function(fecha) {
		if (fecha == null) {
			return '';
		}
		if (typeof fecha == 'string') {
			fecha = new Date(Date.parse(fecha));
		}

		var d2= new Date();
		var d1 = fecha;

		var DateDiff = {

		    inDays: function(d1, d2) {
		        var t2 = d2.getTime();
		        var t1 = d1.getTime();

		        return parseInt((t2-t1)/(24*3600*1000));
		    },

		    inWeeks: function(d1, d2) {
		        var t2 = d2.getTime();
		        var t1 = d1.getTime();

		        return parseInt((t2-t1)/(24*3600*1000*7));
		    },

		    inMonths: function(d1, d2) {
		        var d1Y = d1.getFullYear();
		        var d2Y = d2.getFullYear();
		        var d1M = d1.getMonth();
		        var d2M = d2.getMonth();

		        return (d2M+12*d2Y)-(d1M+12*d1Y);
		    },

		    inYears: function(d1, d2) {
		        return d2.getFullYear()-d1.getFullYear();
		    }
		};
		
		if (DateDiff.inYears(d1, d2) > 0) {
			var edad = DateDiff.inYears(d1, d2) ;
			if (DateDiff.inMonths(d1, d2) > 0) {
				edad--;
			} else if (DateDiff.inMonths(d1, d2) === 0){
				if (DateDiff.inDays(d1, d2) < 0) {
				edad--;
				}
			}
			return edad +' años';
		} else if (DateDiff.inMonths(d1, d2) > 0) {
			return DateDiff.inMonths(d1, d2) +' meses';
		} else if (DateDiff.inDays(d1, d2) > 0) {
			return DateDiff.inDays(d1, d2) +' dias';
		} else {
			return 'la fecha no es correcta';
		}

	};
});

