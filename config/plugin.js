'use strict';

// had enabled by egg
// exports.static = true;

// Node.js 性能平台（alinode）
exports.alinode = {
	enable: true,
	package: 'egg-alinode',
};

// 验证
exports.validate = {
	enable: true,
	package: 'egg-validate',
};

// 加密
exports.bcrypt = {
	enable: true,
	package: 'egg-bcrypt',
};

// Mongodb
exports.mongoose = {
	enable: true,
	package: 'egg-mongoose',
};

// json web token
exports.jwt = {
	enable: true,
	package: 'egg-jwt',
};

// CORS跨域
exports.cors = {
	enable: true,
	package: 'egg-cors',
};

// 模板引擎
exports.nunjucks = {
	enable: true,
	package: 'egg-view-nunjucks',
};

// redis
exports.redis = {
	enable: true,
	package: 'egg-redis',
};

// jssdk
exports.wechatApi = {
	enable: true,
	package: 'egg-wechat-api',
};