function apply(app) {
	var auth = require('../conf/auth');

	//Simple Portal ApiKey based auth ------
	app.post('/weblogin', function(req, res) {
		if (req.body.userPassword == auth.security.apiKey) {
			res.cookie('userPassword', req.body.userPassword, { path: '/' });
	    res.cookie('apikey', req.body.userPassword, { path: '/' });
	    res.cookie('username', req.body.username);
	    res.cookie('roleKey', req.body.roleKey);
	    res.cookie('roleName', req.body.roleName);
	    var user =  {
	        "id": 0, 
	        "user": {
	            "id": 0, 
	            "username": req.body.username, 
	            "role":  {
	                "key": req.body.roleKey, 
	                "name": req.body.roleName, 
	              }
	          } 
	      };
			res.status(200).send(user);
	    console.log(JSON.stringify(user));
		}
		else {
	    res.clearCookie('userPassword');
	    res.clearCookie('username');
	    res.clearCookie('roleKey');
	    res.clearCookie('roleName');
	    res.clearCookie('role');
			res.status(401).send('Unauthorized.');
		}
	});

	app.post('/webLogout', function(req, res) {
		res.cookie('userPassword', '.', { path: '/' }); //ie bug
		//res.clearCookie('apikey', { path: '/' }); 
		res.clearCookie('username');
		res.clearCookie('roleKey');
		res.clearCookie('roleName');
		res.clearCookie('role');
		res.status(200).send('OK');
	});

	//Auth ----------
	app.all('*', function(req, res, next) {
		if (req.url.substr(0,5) != '/api/'){
			return next();
		}
		return isLoggedIn(req, res, next);
	});

	function isLoggedIn(req, res, next) {
		var incomingKey = getHeaderOrParam(req, 'apikey');
		if (incomingKey == auth.security.apiKey){
			return next();
		}
		incomingKey = getHeaderOrParam(req, 'api_key');
		if (incomingKey == auth.security.apiKey){
			return next();
		}	
		res.status(401).send('Unauthorized.');
	}

	function getHeaderOrParam(req, key){
		var cookie = req.cookies[key];
		if (cookie !== undefined){ 
	    return cookie;
	  }
		var header = req.headers[key];
		if (header !== undefined) {
	      return header;
	    }
		return req.query[key];
	}

}
module.exports.apply = apply;