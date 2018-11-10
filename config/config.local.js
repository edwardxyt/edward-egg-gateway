'use strict';
// config/config.local.js
// only read at development mode, will override default

module.exports = appInfo => {
	const config = (exports = {});

	config.security = {
		csrf: {
			// headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
			enable: false
		},
		domainWhiteList: [
			'http://127.0.0.1:7001',
			'http://0.0.0.0:7001',
			'http://10.105.7.118:7001',
			'http://10.105.7.120:7001',
			'http://192.168.31.192:7001',
		]
	};

	config.mongoose = {
		clients: {
			// clientId, access the client instance by app.mongooseDB.get('clientId')
			eggGateway: {
				url: 'mongodb://0.0.0.0:12345/egg-gateway',
				options: {
					// autoIndex: false, // Mongoose-specific option. Set to false to disable automatic index creation for all models associated with this connection.
					useNewUrlParser: true, // False by default. Set to true to make all connections set the useNewUrlParser option by default.
					useCreateIndex: true, // Mongoose-specific option. If true, this connection will use createIndex() instead of ensureIndex() for automatic index builds via Model.init().
					// useFindAndModify: false, // True by default. Set to false to make findOneAndUpdate() and findOneAndRemove() use native findOneAndUpdate() rather than findAndModify().
					user: "egg_gateway_xiayuting",
					pass: "123123qwe",
				}
			},
			eggBlog: {
				url: 'mongodb://0.0.0.0:12345/egg-blog',
				options: {
					// autoIndex: false, // Mongoose-specific option. Set to false to disable automatic index creation for all models associated with this connection.
					useNewUrlParser: true, // False by default. Set to true to make all connections set the useNewUrlParser option by default.
					useCreateIndex: true, // Mongoose-specific option. If true, this connection will use createIndex() instead of ensureIndex() for automatic index builds via Model.init().
					// useFindAndModify: false, // True by default. Set to false to make findOneAndUpdate() and findOneAndRemove() use native findOneAndUpdate() rather than findAndModify().
					user: "egg_blog_xiayuting",
					pass: "123123qwe",
				},
			},
		},
	};

	config.redis = {
		client: {
			port: 12343, // Redis port
			host: '127.0.0.1', // Redis host
			password: '123123qwe',
			db: 0,
		},
	}

	return config;
};