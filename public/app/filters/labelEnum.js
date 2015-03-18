angular.module('myApp').filter('labelEnum', ['$rootScope', 'StaticDataService', function($rootScope, StaticDataService) {
	var data = null;
	//var serviceInvoked = false;

  	function realFilter(enumerationName, key, value) {
  		if (value) {
	        return value;
  		}
  		return key;
    }

	var labelEnumFilter = function(key, enumerationName) {
		if (key == null) {
			return '';
		}
		var enumData = $rootScope.global[enumerationName];

		if (enumerationName === "localidad" ||
			enumerationName === "municipio" ) {

			var data = getFromCache(enumerationName, key);
			if (data && data!=='') {
				return data;
			}

			var serviceInvoked = (data != null);

			if (data == null) {
				if( !serviceInvoked ) {
					 serviceInvoked = true;
					//try direct call by key
					StaticDataService.getEnumerationItemByKey(enumerationName, key)
					  .then(function (httpResponse) {
					  	if (httpResponse.data.length > 0) {
					  		setCache(enumerationName, key, httpResponse.data[0].label);
							data = httpResponse.data[0].label;
							return realFilter(enumerationName, key, data);
					  	}
					  	setCache(enumerationName, key, '');
						data = '';
						return realFilter(enumerationName, key, data);
					  });
					
					setCache(enumerationName, key, '.');
				}
				return '-'; //not yet ready			
			}
			else {
				return realFilter(enumerationName, key, data);
			}
		}
		/*
		else if (enumerationName === "localidad" ||
			enumerationName === "municipio" ) {
			return key; //temporal (resolve to label)
		}
		*/
		else if (enumData == null || enumData.length === 0) {
			return '';	
		}
		else {		
			var elem = enumData.filter(function(item) {
				return item.key === key;
			});

			return (elem.length > 0) ? elem[0].label : ''; 
		}
	};

	function getFromCache(sectionKey, key) {
		if ($rootScope.cache === undefined ) {
			return null;
		}
		if ($rootScope.cache[sectionKey] === undefined ) {
			return null;
		}
		if ($rootScope.cache[sectionKey][key] === undefined ) {
			return null;
		}
		return $rootScope.cache[sectionKey][key];
	}
	function setCache(sectionKey, key, value) {
		if ($rootScope.cache === undefined) {
			$rootScope.cache = {};	
		}
		if ($rootScope.cache[sectionKey] === undefined) {
			$rootScope.cache[sectionKey] = {};	
		}		
		$rootScope.cache[sectionKey][key] = value; 
	}

	labelEnumFilter.$statefull = true;
	return labelEnumFilter;
}]);