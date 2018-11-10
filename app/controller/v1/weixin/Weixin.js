const Controller = require('egg').Controller

class WeixinController extends Controller {
	constructor(ctx) {
		super(ctx)
		this.getConfigRule = {
			url: {
				type: 'string',
				required: true,
				allowEmpty: false,
			}
		}
	}

	// JSSDK
	* getConfig() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.getConfigRule)
		// 组装参数
		const payload = ctx.request.body || {}

		try {
			const ticket = yield ctx.app.wechatApi.getTicket();
			const latestTicket = yield ctx.app.wechatApi.getLatestTicket();
			const config = yield ctx.app.wechatApi.getJsConfig({
				debug: payload.debug,
				url: payload.url,
				jsApiList: payload.jsApiList
			});
			ctx.helper.success({
				ctx,
				res: {
					ticket,
					latestTicket,
					config,
				},
				code: 201
			})
		} catch (error) {
			ctx.helper.error({ ctx, code: 500, msg: error, status: 500 })
		}
	}
}

module.exports = WeixinController