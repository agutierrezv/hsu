//Configuration by enviroment
function getConfiguration(environment)
{
	var configuration = null;

	if (environment === 'production') {
		configuration = {
			environment: 				'production',
			hostUrl: 					'https://hsu.herokuapp.com', 					
			queue: {
				IRON_MQ_PROJECT_ID: 	'55099f33c3d0ef0009000092',
				IRON_MQ_TOKEN: 			'K8eTieqkWOr5r02CbXLqx0Vrkzs'
	 		},
	 		redis: {
	 			REDISCLOUD_URL: 		'redis://rediscloud:IsbbjWjn3Py1gAkF@pub-redis-16434.eu-west-1-1.2.ec2.garantiadata.com:16434'
	 		}
		};
	}
	/*
	else if (enviroment === 'qa') {
		//todo ----
		configuration = {
			environment: 				'qa',
			hostUrl: 					'https://hsu-api.herokuapp.com', 					
			queue: {
				IRON_MQ_PROJECT_ID: 	'54f851267af4ab0009000055',
				IRON_MQ_TOKEN: 			'fmtXe9gTevB0zDk4LWiEIIxy6H8'
	 		}
		}
	}
	*/
	else {  //development settings == devel
		configuration = {
			environment: 				'devel',
			hostUrl: 					'http://localhost:5000', 					
			queue: {
				IRON_MQ_PROJECT_ID: 	'55099f33c3d0ef0009000092',
				IRON_MQ_TOKEN: 			'K8eTieqkWOr5r02CbXLqx0Vrkzs'
	 		},
	 		redis: {
	 			REDISCLOUD_URL: 		null
	 		}

		};
	}
	return configuration;
}

module.exports.getConfiguration = getConfiguration;
