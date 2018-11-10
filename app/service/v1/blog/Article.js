const Service = require('egg').Service
const R = require('ramda')

class ArticleService extends Service {
	// create======================================================================================================>
	async create(payload) {
		const { ctx, service } = this

		// 如果是数组 就直接等于
		// 如果是字符串没有逗号切割就转为数组
		// 如果是字符串还有逗号切割就转为多个数组
		if (R.is(Array, payload.kind)) {
			payload.kind = payload.kind
		} else if (R.is(String, payload.kind) && payload.kind.indexOf(',') > 0) {
			payload.kind = R.split(',', payload.kind)
		} else {
			payload.kind = [payload.kind]
		}

		const res = await ctx.model.BlogArticle.create(payload)

		return res
	}

	// destroy======================================================================================================>
	async destroy(_id) {
		const { ctx, service } = this
		const article = await ctx.service.v1.blog.article.find(_id)
		if (!article) {
			ctx.throw(404, 'article not found')
		}
		return ctx.model.BlogArticle.findByIdAndRemove(_id)
	}

	// update======================================================================================================>
	async update(_id, payload, options) {
		const { ctx, service } = this
		const article = await ctx.service.v1.blog.article.find(_id)
		if (!article) {
			ctx.throw(404, 'article not found')
		}

		// 如果是数组 就直接等于
		// 如果是字符串没有逗号切割就转为数组
		// 如果是字符串还有逗号切割就转为多个数组
		if (R.is(Array, payload.kind)) {
			payload.kind = payload.kind
		} else if (R.is(String, payload.kind) && payload.kind.indexOf(',') > 0) {
			payload.kind = R.split(',', payload.kind)
		} else {
			payload.kind = [payload.kind]
		}

		// update 控制更新其他信息
		const requestBody = {
			pic: payload.pic,
			title: payload.title,
			author: payload.author,
			source: payload.source,
			content: payload.content,
			html: payload.html,
			markdown: payload.markdown,
			code: payload.code,
			kind: payload.kind,
			desc: payload.desc,
			sort: payload.sort,
			status: payload.status,
			keywords: payload.keywords,
			description: payload.description,
			codeJavascript: payload.codeJavascript,
			codeCss: payload.codeCss,
			codeHtml: payload.codeHtml,
			codeMarkdown: payload.codeMarkdown,
		}

		return ctx.model.BlogArticle.findByIdAndUpdate(_id, requestBody, { new: true })
	}


	// 更换头图
	async picUrl(_id, payload, options) {
		const { ctx, service } = this
		const article = await ctx.service.v1.blog.article.find(_id)
		if (!article) {
			ctx.throw(404, 'article not found')
		}

		// update 控制更新其他信息
		const requestBody = {
			pic: payload.pic,
		}

		return ctx.model.BlogArticle.findByIdAndUpdate(_id, requestBody, { new: true, select: 'pic' })
	}

	// 获取一条并增加浏览量
	// 捕获500与404写法
	async getOne(_id) {
		const { ctx, service } = this

		let article
		try {
			article = await ctx.service.v1.blog.article.find(_id)
		} catch (e) {
			ctx.throw(500, 'ID is fail')
		}

		if (!article) {
			ctx.throw(404, 'article not found')
		}

		if (article.status < 1) {
			ctx.throw(422, 'The article is disable！')
		}

		return ctx.model.BlogArticle.findByIdAndUpdate(_id, { $inc: { "count": 1 } }, { new: true })
	}

	// show======================================================================================================>
	async show(_id) {
		const article = await this.ctx.service.v1.blog.article.find(_id)

		if (!article) {
			this.ctx.throw(404, 'BlogArticle not found')
		}
		return this.ctx.model.BlogArticle.findById(_id)
	}

	// index======================================================================================================>
	async index(payload) {
		const { currentPage = 1, pageSize = 20, isPaging = 1, status = 0, search = '', html = '', kind = [], select = '' } = payload
		// 1(当前) 5（一页多少条） 1（开启分页） undefined（搜索条件）
		let res = [] //结果
		let count = 0
		let skip = (Number(currentPage) - 1) * Number(pageSize || 10) //跳页

		if (isPaging - 0) {
			if (kind.length > 0) {
				console.log('1 开启分页 开启分类');
				res = await this.ctx.model.BlogArticle.find({ status: { "$gte": status }, title: { $regex: search }, html: { $regex: html }, kind: { $in: kind } })
					.select(select)
					.skip(skip)
					.limit(Number(pageSize))
					.sort({ createdAt: -1 })
					.exec()
				count = await this.ctx.model.BlogArticle.countDocuments({ status: { "$gte": status }, title: { $regex: search }, html: { $regex: html }, kind: { $in: kind } })
					.exec()
			} else {
				console.log('2 开启分页 关闭分类');
				res = await this.ctx.model.BlogArticle.find({ status: { "$gte": status }, title: { $regex: search }, html: { $regex: html } })
					.select(select)
					.skip(skip)
					.limit(Number(pageSize))
					.sort({ createdAt: -1 })
					.exec()
				count = await this.ctx.model.BlogArticle.countDocuments({ status: { "$gte": status }, title: { $regex: search }, html: { $regex: html } })
					.exec()
			}
		} else {
			if (kind.length > 0) {
				console.log('3 关闭分页 开启分类');
				res = await this.ctx.model.BlogArticle.find({ status: { "$gte": status }, title: { $regex: search }, html: { $regex: html }, kind: { $in: kind } })
					.sort({ createdAt: -1 })
					.exec()
			} else {
				console.log('4 关闭分页 关闭分类');
				res = await this.ctx.model.BlogArticle.find({ status: { "$gte": status }, title: { $regex: search }, html: { $regex: html } })
					.sort({ createdAt: -1 })
					.exec()
			}
			count = res.length // 只要关闭分页，直接读取条数即可
		}

		// 整理数据源 -> Ant Design Pro
		let data = res.map((e, i) => {
			if (!e.createdAt) {
				ctx.throw(404, 'undefined is error')
			}
			const jsonObject = Object.assign({}, e._doc)
			jsonObject.key = i
			jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
			jsonObject.updatedAt = this.ctx.helper.formatTime(e.updatedAt)
			return jsonObject
		})

		return {
			count: count,
			list: data,
			pageSize: Number(pageSize),
			currentPage: Number(currentPage)
		}
	}

	async findByTitle(title) {
		return this.ctx.model.BlogArticle.findOne({ title: title })
	}

	// removes======================================================================================================>
	async removes(values) {
		return this.ctx.model.BlogArticle.remove({ _id: { $in: values } })
	}

	// Commons======================================================================================================>
	async find(id) {
		return this.ctx.model.BlogArticle.findById(id)
	}
}

module.exports = ArticleService