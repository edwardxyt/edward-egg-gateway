'use strict';
module.exports = appInfo => {
	const config = (exports = {});

	config.security = {
		csrf: {
			// headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
			enable: false
		},
		domainWhiteList: [
			'http://blog.xiayuting.cc',
			'http://admin.xiayuting.cc',
			'http://yapi.xiayuting.cc',
		]
	};

	// 启动配置项
	config.cluster = {
		listen: {
			port: 8001,
			hostname: '127.0.0.1',
		},
	};

	config.mongoose = {
		clients: {
			// clientId, access the client instance by app.mongooseDB.get('clientId')
			eggGateway: {
				url: 'mongodb://127.0.0.1:12345/egg-gateway',
				options: {
					useNewUrlParser: true,
					useCreateIndex: true,
					user: "egg_gateway_xiayuting",
					pass: ""
				}
			},
			eggBlog: {
				url: 'mongodb://127.0.0.1:12345/egg-blog',
				options: {
					useNewUrlParser: true,
					useCreateIndex: true,
					user: "egg_blog_xiayuting",
					pass: ""
				},
			},
		},
	};

	config.redis = {
		client: {
			port: 12343, // Redis port
			host: '127.0.0.1', // Redis host
			password: '',
			db: 0,
		},
	}

	config.logger = {
		dir: '/workbase/logs',
		appLogName: `${appInfo.name}-web.log`,
		coreLogName: 'egg-web.log',
		agentLogName: 'egg-agent.log',
		errorLogName: 'common-error.log'
	};

	return config;
};