'use strict'

const formatStr = (ctx, str) => {
	return str.split('/').filter(i => i).map(item => {

		if (item.indexOf('?') > 0) {
			item = item.slice(0, item.indexOf('?'))
		}


		if (ctx.params.id === item) {
			try {
				ctx.app.mongoose.Types.ObjectId(item);
				item = ':id'
			} catch (e) {
				ctx.helper.error({ ctx, code: 402, msg: '参数错误', status: 402 })
			}
		}

		// 这里12 24 有问题不匹配 bug
		// 这里mongo ID 不一定是数字开头
		// if (/^[0-9]|[a-z]{24}$/.test(item)) {
		// 	item = ':id'
		// }

		// if (/?\.(gif|jpg|jpeg|png|svn|doc|docx|ppt|pptx|xls|xlsx|csv|key|numbers|pages|pdf|txt|psd|zip|gz|tgz|gzip|mov|mp4|avi|mp3|wma|wav|ogg|ape|acc)$/.test(item)) {
		// 	item = ':name'
		// }

		return item
	})
}

module.exports = () => {
	/**
	 * [根据请求的方法、URL字段数、接口名称 判断是否有权限]
	 * @param  {[type]}   ctx  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	return async function(ctx, next) {
		const { method, url } = ctx.request
		const permissions = await ctx.app.redis.get(`egg-gateway:admin:userAccess:${ctx.state.user.data._id}:permissions`)

		const router = formatStr(ctx, url)

		ctx.print(`${method}|${router.join('|')}`)

		if (JSON.parse(permissions)[`${method}|${router.join('|')}`]) {
			await next();
		} else {
			ctx.helper.error({ ctx, code: 401, msg: '无权限访问！请联系系统管理员。', status: 401 })
		}
	};
};