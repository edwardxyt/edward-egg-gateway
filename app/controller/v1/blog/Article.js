const Controller = require('egg').Controller

class ArticleController extends Controller {
	constructor(ctx) {
		super(ctx)

		this.createArticle = {
			title: {
				type: 'string',
				required: true,
				allowEmpty: false,
			},
			author: {
				type: 'string',
				required: true,
				allowEmpty: false,
			},
			content: {
				type: 'object',
				required: true,
				allowEmpty: false,
			},
		}

		this.removesArticle = {
			id: {
				type: 'string',
				required: true,
				allowEmpty: false,
			}
		}

		this.picArticle = {
			pic: {
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
		ctx.validate(this.createArticle)
		// 组装参数
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.article.create(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 删除单个栏目
	async destroy() {
		const { ctx, service } = this
		// 校验参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		await service.v1.blog.article.destroy(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	// 修改文章
	async update() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.createArticle)
		// 组装参数
		const { id } = ctx.params
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.article.update(id, payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 修改文章
	async picUrl() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.picArticle)
		// 组装参数
		const { id } = ctx.params
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.article.picUrl(id, payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 获取单个栏目
	async show() {
		const { ctx, service } = this
		// 组装参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.article.show(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 获取所有栏目(分页/模糊)
	async index() {
		const { ctx, service } = this
		// 组装参数
		const payload = ctx.query
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.article.index(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 前台获取文章列表
	async list() {
		const { ctx, service } = this
		const { kind, html, currentPage } = ctx.query
		// 组装参数
		const payload = {
			kind,
			html,
			currentPage,
			status: 1,
			select: 'title kind desc pic createdAt updatedAt'
		}
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.article.index(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 获取一条并增加浏览量
	async getOne() {
		const { ctx, service } = this
		// 组装参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		const res = await service.v1.blog.article.getOne(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 删除所选栏目(条件id[])
	async removes() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.removesArticle)
		// 组装参数
		// const payload = ctx.queries.id
		const { id } = ctx.request.body

		const payload = id.split(',').filter(i => i)

		// 调用 Service 进行业务处理
		const result = await service.v1.blog.article.removes(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}
}

module.exports = ArticleController