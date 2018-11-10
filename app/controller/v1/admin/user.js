const Controller = require('egg').Controller

class UserController extends Controller {
	constructor(ctx) {
		super(ctx)

		this.UserCreateRule = {
			mobile: {
				type: 'string',
				required: true,
				allowEmpty: false,
				format: /^[0-9]{11}$/
			},
			password: { type: 'password', required: true, allowEmpty: false, min: 6 },
			realName: {
				type: 'string',
				required: true,
				allowEmpty: false,
				format: /^[\u2E80-\u9FFF]{2,6}$/
			}
		}

		this.UserRegister = {
			mobile: {
				type: 'string',
				required: true,
				allowEmpty: false,
				format: /^[0-9]{11}$/
			},
			password: { type: 'password', required: true, allowEmpty: false, min: 6 },
			realName: {
				type: 'string',
				required: true,
				allowEmpty: false,
				format: /^[\u2E80-\u9FFF]{2,6}$/
			},
			captcha: { type: 'string', required: true, allowEmpty: false },
			captchaToken: {
				type: 'string',
				required: true,
				allowEmpty: false,
			},
		}

		this.UserPassword = {
			password: { type: 'password', required: true, allowEmpty: false, min: 6 },
		}

		this.UserUpdateRule = {
			mobile: { type: 'string', required: true, allowEmpty: false },
			realName: {
				type: 'string',
				required: true,
				allowEmpty: false,
				format: /^[\u2E80-\u9FFF]{2,6}$/
			}
		}
	}

	// 创建用户
	async create() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.UserCreateRule)
		// 组装参数
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.user.create(payload, 1)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 重置密码
	async resetPassword() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.UserPassword)
		// 组装参数
		const { id } = ctx.params
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.user.resetPassword(id, payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 注册用户
	async register() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.UserRegister)
		// 组装参数
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.user.create(payload, 0)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 删除单个用户
	async destroy() {
		const { ctx, service } = this
		// 校验参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		await service.v1.admin.user.destroy(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	// 修改用户
	async update() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.UserUpdateRule)
		// 组装参数
		const { id } = ctx.params
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		await service.v1.admin.user.update(id, payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	// 获取单个用户
	async show() {
		const { ctx, service } = this
		// 组装参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.user.show(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 获取所有用户(分页/模糊)
	async index() {
		const { ctx, service } = this
		// 组装参数
		const payload = ctx.query
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.user.index(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 删除所选用户(条件id[])
	async removes() {
		const { ctx, service } = this
		// 组装参数
		// const payload = ctx.queries.id
		const { id } = ctx.request.body

		const payload = id.split(',').filter(item => item)

		// 调用 Service 进行业务处理
		const result = await service.v1.admin.user.removes(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}
}

module.exports = UserController