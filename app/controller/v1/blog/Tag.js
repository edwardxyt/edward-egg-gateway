const Controller = require('egg').Controller

class TagController extends Controller {
	constructor(ctx) {
		super(ctx)

		this.createTag = {
			name: {
				type: 'string',
				required: true,
				allowEmpty: false,
			},
		}

		this.removesTag = {
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
		ctx.validate(this.createTag)
		// 组装参数
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.tag.create(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 删除单个栏目
	async destroy() {
		const { ctx, service } = this
		// 校验参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		await service.v1.blog.tag.destroy(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	// 修改文章
	async update() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.createTag)
		// 组装参数
		const { id } = ctx.params
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.tag.update(id, payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 获取单个栏目
	async show() {
		const { ctx, service } = this
		// 组装参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.tag.show(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 获取所有栏目(分页/模糊)
	async index() {
		const { ctx, service } = this
		// 组装参数
		const payload = ctx.query
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.tag.index(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 获取所有分类
	async list() {
		const { ctx, service } = this
		// 组装参数
		const payload = {
			isPaging: 0
		}
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.tag.index(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 删除所选栏目(条件id[])
	async removes() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.removesTag)
		// 组装参数
		// const payload = ctx.queries.id
		const { id } = ctx.request.body

		const payload = id.split(',').filter(i => i)

		// 调用 Service 进行业务处理
		const result = await service.v1.blog.tag.removes(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}
}

module.exports = TagController