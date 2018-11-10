'use strict';

module.exports = appInfo => {
	const config = (exports = {});

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_1536208055819_2722';

	config.proxy = true

	// add your config here
	config.middleware = ['errorHandler'];

	// 添加 view 配置
	config.view = {
		defaultViewEngine: 'nunjucks',
		mapping: {
			'.tpl': 'nunjucks',
		},
	};

	// 从 `Node.js 性能平台` 获取对应的接入参数
	config.alinode = {
		server: 'wss://agentserver.node.aliyun.com:8080',
		appid: '75834',
		secret: '770330dcd6e86fde4c93f33c56c45ab6a1f5cd30',
	};

	config.multipart = {
		fileExtensions: [
			'.apk',
			'.pptx',
			'.docx',
			'.csv',
			'.doc',
			'.ppt',
			'.pdf',
			'.pages',
			'.wav',
			'.mov',
		] // 增加对 .apk 扩展名的支持
	}

	// 加密
	config.bcrypt = {
		saltRounds: 10, // default 10
	};

	config.session = {
		key: 'EGG_SESS',
		maxAge: 24 * 3600 * 1000, // 1 天
		httpOnly: true,
		encrypt: true,
	};

	config.jwt = {
		secret: '^$%#^*#@123qweasdzxc',
		exp: 60 * 60 * 24, //自定义配置
		// enable: true, // default is false 启动后app.jwt失效
		// match: '/api/user/access/current', //匹配
		// ignore: '/api/user/access/login', //不匹配
	};

	// 注释 origin: '*' 后 白名单将开启
	config.cors = {
		origin: '*',
		allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
	};

	exports.wechatApi = {
		appId: 'wx7cf8fb2300792bb5',
		appSecret: '02a8c90d37d10f8a40e7ad02e602289e',
	};

	return config;
};