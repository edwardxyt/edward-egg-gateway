'use strict';

/**
 * [exports 路由注意*****顺序，顺序，顺序，顺序，顺序*****]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
module.exports = app => {
	// jwt中间件会处理 Authorization: Bearer ********
	// note: 使用app.jwt时 config.default.js下config.jwt.enable必须为false
	const { router, controller, jwt, middlewares: { expiresHandler, permissionsHandler, checkToken } } = app;

	// home
	router.get('/api', controller.home.index);

	// role
	router.post('/api/v1/role/resetAvatar', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.role.resetAvatar)
	router.delete('/api/v1/role/removes', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.role.removes)
	router.resources('role', '/api/v1/role', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.role)

	// user
	// 注册验证权限
	router.delete('/api/v1/user/removes', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.user.removes)
	router.post('/api/v1/user/register', controller.v1.admin.user.register)
	router.put('/api/v1/user/resetPassword/:id', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.user.resetPassword)
	router.resources('user', '/api/v1/user', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.user)

	// column
	router.delete('/api/v1/column/removes', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.column.removes)
	router.resources('column', '/api/v1/column', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.column)

	// ability
	router.delete('/api/v1/ability/removes', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.ability.removes)
	router.resources('ability', '/api/v1/ability', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.ability)

	// userAccess
	// 登录、退出不验证权限
	router.post('/api/v1/user/access/login', controller.v1.admin.userAccess.login)
	router.get('/api/v1/user/access/captcha', controller.v1.admin.userAccess.captcha)
	router.get('/api/v1/user/access/current', jwt, expiresHandler(), controller.v1.admin.userAccess.current)
	router.get('/api/v1/user/access/logout', jwt, expiresHandler(), controller.v1.admin.userAccess.logout)
	router.put('/api/v1/user/access/resetPsw', jwt, expiresHandler(), controller.v1.admin.userAccess.resetPsw)
	router.put('/api/v1/user/access/resetSelf', jwt, expiresHandler(), controller.v1.admin.userAccess.resetSelf)
	router.post('/api/v1/user/access/resetAvatar', jwt, expiresHandler(), controller.v1.admin.userAccess.resetAvatar)

	// contingency
	// 获取权限接口不验证权限
	router.post('/api/v1/rbac/contingencyRole', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.rbac.contingencyRole)
	router.get('/api/v1/rbac/getPermissions/:id', jwt, expiresHandler(), controller.v1.admin.rbac.getPermissions)
	router.post('/api/v1/rbac/contingencyColumn', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.rbac.contingencyColumn)
	router.post('/api/v1/rbac/contingencyAbility', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.rbac.contingencyAbility)

	// upload
	// router.post('/api/v1/upload/:id', controller.v1.admin.upload.update) // Ant Design Pro 目前无用

	router.post('/api/v1/upload/url', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.upload.url)
	router.post('/api/v1/uploads', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.upload.multiple)
	router.delete('/api/v1/upload/removes', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.upload.removes)
	router.post('/api/v1/upload/:id', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.upload.update)
	router.put('/api/v1/upload/:id/extra', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.upload.extra)
	router.get('/api/v1/upload/download', checkToken, jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.upload.download)
	router.resources('upload', '/api/v1/upload', jwt, expiresHandler(), permissionsHandler(), controller.v1.admin.upload)


	/**
	 * 博客接口
	 * ============================================================================================================================================================================================================>
	 */
	// article
	router.get('/api/v1/blog/article/list', controller.v1.blog.article.list)
	router.get('/api/v1/blog/article/getOne/:id', controller.v1.blog.article.getOne)
	router.put('/api/v1/blog/article/picUrl/:id', jwt, expiresHandler(), permissionsHandler(), controller.v1.blog.article.picUrl)
	router.delete('/api/v1/blog/article/removes', jwt, expiresHandler(), permissionsHandler(), controller.v1.blog.article.removes)
	router.resources('article', '/api/v1/blog/article', jwt, expiresHandler(), permissionsHandler(), controller.v1.blog.article)

	// tag
	router.get('/api/v1/blog/tag/list', controller.v1.blog.tag.list)
	router.delete('/api/v1/blog/tag/removes', jwt, expiresHandler(), permissionsHandler(), controller.v1.blog.tag.removes)
	router.resources('tag', '/api/v1/blog/tag', jwt, expiresHandler(), permissionsHandler(), controller.v1.blog.tag)


	/**
	 * JS-SDK接口
	 * ============================================================================================================================================================================================================>
	 */
	router.post('/api/v1/weixin/getConfig', controller.v1.weixin.weixin.getConfig)
};