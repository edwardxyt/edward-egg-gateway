'use strict'

module.exports = () => {
	/**
	 * [唯一地址登录，token比较redis中，Token字符串相等时才有效]
	 * @param  {[type]}   ctx  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	return async function(ctx, next) {
		let requestToken = ctx.get('authorization').replace(/Bearer /, '')
		let redisToken = await ctx.app.redis.get(`egg-gateway:admin:userAccess:${ctx.state.user.data._id}:token`)
		if (requestToken === redisToken) {
			await next();
		} else {
			ctx.helper.error({ ctx, code: 401, msg: '登录已过期', status: 401 })
		}
	};
};