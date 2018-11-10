const Controller = require('egg').Controller

class ColumnController extends Controller {
	constructor(ctx) {
		super(ctx)

		this.createColumn = {
			name: {
				type: 'string',
				required: true,
				allowEmpty: false,
				format: /^[\u2E80-\u9FFF]{2,12}$/
			},
			path: { type: 'string', required: true, allowEmpty: false },
			root: { type: 'string', required: true, allowEmpty: false },
		}

		this.removesColumn = {
			id: {
				type: 'string',
				required: true,
				allowEmpty: false,
			}
		}
	}

	// 创建栏目
	async create() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.createColumn)
		// 组装参数
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.column.create(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 删除单个栏目
	async destroy() {
		const { ctx, service } = this
		// 校验参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		await service.v1.admin.column.destroy(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	// 修改栏目
	async update() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.createColumn)
		// 组装参数
		const { id } = ctx.params
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		await service.v1.admin.column.update(id, payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	// 获取单个栏目
	async show() {
		const { ctx, service } = this
		// 组装参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.column.show(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 获取所有栏目(分页/模糊)
	async index() {
		const { ctx, service } = this
		// 组装参数
		const payload = ctx.query
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.column.index(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 删除所选栏目(条件id[])
	async removes() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.removesColumn)
		// 组装参数
		// const payload = ctx.queries.id
		const { id } = ctx.request.body

		const payload = id.split(',').filter(i => i)

		// 调用 Service 进行业务处理
		const result = await service.v1.admin.column.removes(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}
}

module.exports = ColumnController