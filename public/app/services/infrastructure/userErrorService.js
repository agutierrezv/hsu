angular.module('myApp').service('UserErrorService', [function () {
	
	var Service = {};	

	Service.translateErrors = function (httpError, operationType) {
		if (httpError == null || httpError.data == null) {
			return null;
		}
		var errors = [];
		if (typeof httpError.data === 'string') {
			if (httpError.status == 404 && operationType == "delete") {
				errors.push("El objeto que intenta borrar no existe.");			
				return errors;
			}
			if (httpError.status == 404) {
				errors.push("El objeto no existe.");	
				return errors;		
			}
		} 
		else {
			Object.keys(httpError.data).forEach(function(key) {
				var errItem = httpError.data[key];
				errors.push(processError(operationType, httpError.status, httpError.statusText, errItem));
			});			
		}
		return errors;
	};

	var requiredErrorRegex = /Path `(\w+)` is required./;

	function processError(operationType, statusCode, statusText, error) {
		if (statusCode == 422 && error.type === "unique" && error.name === "MongoError") {
			return "Error por clave duplicada. Ya existe una entrada con estos datos.";
		}

		var match = requiredErrorRegex.exec(error.message);
		if (match) {
			return "Debe proporcionar valor al campo " + translateSymbol(match[1]) + ".";
		}
		return error.message;
	}

	function translateSymbol(symbol) {
		var data = symbols[symbol];
		if (data != null) {
			return data;
		}
		return symbol;
	}

	function stringContains(text, substring) {
		return text.indexOf(substring) > -1;
	}

	//Tabla de simbolos y etiquetas de usuario
	var symbols = {
		"tipoVia" : "Tipo de via",
		"codigoPostal": "Código postal",
		"fechaNacimiento": "Fecha de Nacimiento",		
	};

	return Service;
}]);
