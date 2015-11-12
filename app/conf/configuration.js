//Configuration by enviroment
function getConfiguration(environment)
{
	var configuration = null;

	if (environment === 'production') {
		configuration = {
			environment: 				'production',
			hostUrl: 					'https://hsu.herokuapp.com', 					
			queue: {
				IRON_MQ_PROJECT_ID: 	'54f851267af4ab0009000055',
				IRON_MQ_TOKEN: 			'fmtXe9gTevB0zDk4LWiEIIxy6H8'
	 		},
	 		redis: {
	 			REDISCLOUD_URL: 		'redis://rediscloud:FGVmBwfw8aeLhwjN@pub-redis-16696.us-east-1-4.1.ec2.garantiadata.com:16696'
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
				IRON_MQ_PROJECT_ID: 	'54f851267af4ab0009000055',
				IRON_MQ_TOKEN: 			'fmtXe9gTevB0zDk4LWiEIIxy6H8'
	 		},
	 		redis: {
	 			REDISCLOUD_URL: 		null
	 		}

		};
	}
	return configuration;
}

module.exports.getConfiguration = getConfiguration;
