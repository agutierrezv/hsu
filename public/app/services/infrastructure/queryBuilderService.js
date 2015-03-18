angular.module('myApp').service('QueryBuilderService', [function () {

	function buildBaucisQuery(opts) {
		opts = opts || {};
		var q ='';
		var prefix='';
		var clause1 = null;
		var clause2 = null;

		if (opts.page == null && opts.blockSize == null) {			
		}
		else {
			opts.page = opts.page || 1;
			opts.pageSize = opts.pageSize || 20;
			
			var skip =  (opts.page-1)*opts.pageSize;
			if(skip > 0) {
				q += prefix + 'skip=' + skip;
				prefix='&';			
			}
			q += prefix + 'limit=' + opts.pageSize;
			prefix='&';
		}
		if (opts.sort) {
			q += prefix + 'sort=' + encodeURIComponent(opts.sort);
			prefix='&';
		}			
		if (opts.criteria) {
			q += prefix + 'conditions=' + encodeURIComponent(opts.criteria) ;
			prefix='&';
		}
		if (opts.select) {
			q += prefix + 'select=' + encodeURIComponent(opts.select);
			prefix='&';
		}
		if (opts.populate) {
			q += prefix + 'populate=' + encodeURIComponent(opts.populate);
			prefix='&';
		}
		if (opts.hint) {
			q += prefix + 'hint={' + encodeURIComponent(opts.hint) + '}';
			prefix='&';
		}
		if (opts.count === true) {
			q += prefix + 'count=true';
			prefix='&';
		}
		if (opts.searchText && opts.searchText!=='') {
			//Do a custom like query
			var likeQuery = buildLikeQuery(opts);   
			if (likeQuery) {
				q += prefix + 'conditions=' + encodeURIComponent(likeQuery);
			}
		}
		if (q) {
			return '?' + q;
		}
		return '';
	}

	function uriEncode(data) {
		return 	encodeURIComponent(data);
	}
	function uriDecode(data) {
		return 	decodeURIComponent(data);
	}


	function filterNulls(collection) {
		var col = collection.filter(function(item) {
			if (item != null) {
				return item;
			}
		});
		return col;
	}

	function andBuild(clauseArray) {
		var col = filterNulls(clauseArray);
		if (col.length === 0) {
			return null;
		}
		if (col.length === 1) {
			return col[0];
		}
		var res = '{"$and":[';
		var prefix ='';
		for(var i=0; i<col.length; i++) {
			var item = col[i];
			res += prefix + item;
			prefix =',';
		}
		res += ']}';
		return res;
	}
	function orBuild(clauseArray) {
		var col = filterNulls(clauseArray);
		if (col.length === 0) {
			return null;
		}
		if (col.length === 1) {
			return col[0];
		}
		var res = '{"$or":[';
		var prefix ='';
		for(var i=0; i<col.length; i++) {
			var item = col[i];
			res += prefix + item;
			prefix =',';
		}
		res += ']}';
		return res;
	}

	function buildStringExactMatch(propName, value) {
		return '{"'+ propName +'":"'+ value +'"}';
	}
	function buildExactMatch(propName, value) {
		return '{"'+ propName +'":'+ value +'}';
	}

	function buildStringLike(property, searchValue) {
		if (searchValue == null){
			return null;
		}
		return '{"'+ property +'":{"$regex":"' + escapeForRegex(searchValue) + '","$options":"i"}}';
	}
	function buildNumberEquals(property, searchValue) {
		if (!isNumber(searchValue)) {
			return null;
		}
		var num = Number(searchValue);
		return '{"'+ property +'":' +  num + '}';
	}
	function buildBooleanEquals(property, searchValue) {
		var boolValue = strToBool(searchValue);
		if (boolValue == null) {
			return null;
		}
		return '{"'+ property +'":' +  boolValue + '}';			
	}
	
	function buildDateTimeInRange(property, searchValue) {
		var dateTime; 
		if (isDate(searchValue)) {
			dateTime = toDate(searchValue);
		} else {
			dateTime = toDateTime(searchValue);			
		}

		if (!dateTime) {
			return null;
		}
		var offset = 0;
		if (dateTime.getMilliseconds() !== 0) {
			offset = 1; //1 ms
		}
		else if (dateTime.getSeconds() !== 0) {
			offset = 1000; //1 s
		}
		else if (dateTime.getMinutes() !== 0) {
			offset = 1000 * 60; // 1 minute
		}
		else if (dateTime.getHours() !== 0) {
			offset = 1000 * 60 * 60; //1 hour
		}
		else {
			offset = 1000 * 60 * 60 * 24; //24 hour
		}

		//{"prop":{"$lte":"1946-07-01T22:01:00.000Z","$gt":"1940-07-01T22:01:00.000Z"}}
		var dStart = dateTime.toISOString();
		var dEnd = new Date(dateTime.getTime() + offset).toISOString();
		 
		return '{"'+ property +'":{"$gte":"' +  dStart + '","$lt":"' + dEnd + '"}}';			
	}


	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	function isDateTime(str) {
		return /^\d+\/\d+\/\d+ \d+:\d+$/.test(str);
	}
	function isTime(str) {
		return /^\d+:\d+$/.test(str);
	}
	function isDate(str) {
		return /^\d+\/\d+\/\d+$/.test(str);
	}
	function toDateTime(str) {
		// dd/MM/yyy  hh:mm
		var parts = str.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
		if (parts[3].length==2) {
			var num = Number(parts[3]);
			if (num < 20) {
				parts[3] = num + 2000;
			}
			else {
				parts[3] = num + 1900;
			}
		}
		//dd/MM/yyyy Assuming Spanish formar for dates
		return new Date(parts[3], Number(parts[2])-1, Number(parts[1]), Number(parts[4]), Number(parts[5]));
	}
	function toTime(str) {
		// hh:mm
		var parts = str.match(/(\d+):(\d+)/);
		return new Date(0, 0, 0, Number(parts[1]), Number(parts[2]));
	}
	function toDate(str) {
		// dd/MM/yyy
		var parts = str.match(/(\d+)\/(\d+)\/(\d+)/);
		if (parts[3].length==2) {
			var num = Number(parts[3]);
			if (num < 20) {
				parts[3] = num + 2000;
			}
			else {
				parts[3] = num + 1900;
			}
		}
		//dd/MM/yyyy Assuming Spanish formar for dates
		return new Date(Number(parts[3]), Number(parts[2])-1, Number(parts[1]));
	}	


	function escapeForRegex(candidate) {
		//escape values for regex
		return candidate;
	}
	var boolValues = {
		"true"	: "true",
		"yes" 	: "true",
		"false"	: "false",
		"no"	: "false"
	};
	function strToBool(candidate) {
		var value = candidate.toLowerCase();
		var boolVal = boolValues[value];

		if (boolVal == null) { 
			return null;
		}
		return boolVal;
	}

	function buildLikeQuery(opts) {
		if (opts.searchText==null || opts.searchText==='') {
			return null;
		}
		var searchClauses = opts.searchText.match(/(\w+)=([^ ]*)\s*/g);

		if (searchClauses == null) {
			return buildMoongooseLikeQuery(opts.searchText, opts.fields);
		}
		var clauses = [];
		for(var i=0; i<searchClauses.length; i++) {
			var parts = searchClauses[i].match(/(\w+)=([^ ]*)/);	

			var field = parts[1];
			var value = parts[2];
			clauses.push({
				'name': field,
				'value': value
			});	
		}
		return buildMoongooseNamedQueries(clauses, opts);
	}

	function buildMoongooseNamedQueries(inClauses, opts) {
		if (!inClauses || !opts || !opts.fields ) {
			return null;
		}

		var clauses = [];
		for (var i=0; i<inClauses.length; i++) {
			var inClause = inClauses[i];

			var searchIsNumber = isNumber(inClause.value);
			var searchIsBoolean = strToBool(inClause.value) != null;
			var searchIsDate = isDate(inClause.value);
			var searchIsTime = isTime(inClause.value);
			var searchIsDateTime = isDateTime(inClause.value);

			var type = findFieldType(opts.fields, inClause.name);
			if (type) {
				if (type==="string") {
					clauses.push(buildStringLike(inClause.name, inClause.value));
				}
				else if (searchIsNumber && type==="number") {
					clauses.push(buildNumberEquals(inClause.name, inClause.value));
				}
				else if (searchIsBoolean && type==="bool") {
					clauses.push(buildBooleanEquals(inClause.name, inClause.value));
				}
				else if (searchIsDate && type==="date") {
					clauses.push(buildDateTimeInRange(inClause.name, inClause.value));
				}
				else if (searchIsDateTime && type==="datetime") {
					clauses.push(buildDateTimeInRange(inClause.name, inClause.value));
				}
			}
		}
		return QueryBuilderService.andBuild(clauses);
	}
	function findFieldType(metadata, fieldName) {
		for(var i=0; i<metadata.length; i++) {
			var field = metadata[i];
			if  (field.name.toLowerCase() === fieldName.toLowerCase()) {
				return field.type;
			}
		}
		return null;
	}

	function buildMoongooseLikeQuery(searchText, fieldsMetadata) {
		if (!searchText || !fieldsMetadata ) {
			return null;
		}

		var clauses = [];
		var searchIsNumber = isNumber(searchText);
		var searchIsBoolean = strToBool(searchText) != null;
		var searchIsDate = isDate(searchText);
		var searchIsTime = isTime(searchText);
		var searchIsDateTime = isDateTime(searchText);

		for (var i=0; i<fieldsMetadata.length; i++) {
			var field = fieldsMetadata[i];
			if (field.type==="string") {
				clauses.push(buildStringLike(field.name, searchText));
			}
			else if (searchIsNumber && field.type==="number") {
				clauses.push(buildNumberEquals(field.name, searchText));
			}
			else if (searchIsBoolean && field.type==="bool") {
				clauses.push(buildBooleanEquals(field.name, searchText));
			}
			else if (searchIsDate && field.type==="date") {
				clauses.push(buildDateTimeInRange(field.name, searchText));
			}
			else if (searchIsDateTime && field.type==="datetime") {
				clauses.push(buildDateTimeInRange(field.name, searchText));
			}
		}

		return QueryBuilderService.orBuild(clauses);
	}

	//publish API
	var QueryBuilderService = {
		uriEncode				: uriEncode,
		uriDecode				: uriDecode,
		buildBaucisQuery 		: buildBaucisQuery,
		andBuild 				: andBuild,
		orBuild 				: orBuild,
		buildStringExactMatch 	: buildStringExactMatch,
		buildExactMatch 		: buildExactMatch
	};

	return QueryBuilderService;

}]);
