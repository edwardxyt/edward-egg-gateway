'use strict'

module.exports = async (ctx, next) => {
	const { queryToken } = ctx;

	if (queryToken) {
		ctx.request.header["authorization"] = queryToken
		await next();
	} else {
		ctx.helper.error({ ctx, code: 422, msg: 'miss in token query', status: 422 })
	}
};