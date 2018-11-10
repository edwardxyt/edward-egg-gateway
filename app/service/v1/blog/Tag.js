const Service = require('egg').Service

class TagService extends Service {
	// create======================================================================================================>
	async create(payload) {
		const { ctx, service } = this

		const res = await ctx.model.BlogTag.create(payload)

		return res
	}

	// destroy======================================================================================================>
	async destroy(_id) {
		const { ctx, service } = this
		const tag = await ctx.service.v1.blog.tag.find(_id)
		if (!tag) {
			ctx.throw(404, 'tag not found')
		}
		return ctx.model.BlogTag.findByIdAndRemove(_id)
	}

	// update======================================================================================================>
	async update(_id, payload, options) {
		const { ctx, service } = this
		const tag = await ctx.service.v1.blog.tag.find(_id)
		if (!tag) {
			ctx.throw(404, 'tag not found')
		}

		// update 控制更新其他信息
		const requestBody = {
			name: payload.name,
			desc: payload.desc,
			sort: payload.sort,
			status: payload.status,
		}

		return ctx.model.BlogTag.findByIdAndUpdate(_id, requestBody, { new: true })
	}

	// show======================================================================================================>
	async show(_id) {
		const tag = await this.ctx.service.v1.blog.tag.find(_id)

		if (!tag) {
			this.ctx.throw(404, 'BlogTag not found')
		}
		return this.ctx.model.BlogTag.findById(_id).populate('BlogTag')
	}

	// index======================================================================================================>
	async index(payload) {
		const { currentPage = 1, pageSize = 20, isPaging = 1, search = '' } = payload
		// 1(当前) 5（一页多少条） 1（开启分页） undefined（搜索条件）
		let res = [] //结果
		let count = 0
		let skip = (Number(currentPage) - 1) * Number(pageSize || 10) //跳页

		if (isPaging - 0) {
			console.log('1 开启分页');
			res = await this.ctx.model.BlogTag.find({ name: { $regex: search } })
				.skip(skip)
				.limit(Number(pageSize))
				.sort({ createdAt: -1 })
				.exec()
			count = await this.ctx.model.BlogTag.countDocuments({ name: { $regex: search } })
				.exec()
		} else {
			console.log('2 关闭分页');
			res = await this.ctx.model.BlogTag.find({ name: { $regex: search } })
				.sort({ createdAt: -1 })
				.exec()
			count = res.length // 只要关闭分页，直接读取条数即可
		}

		// 整理数据源 -> Ant Design Pro
		let data = res.map((e, i) => {
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

	// removes======================================================================================================>
	async removes(values) {
		return this.ctx.model.BlogTag.remove({ _id: { $in: values } })
	}

	async findByName(name) {
		return this.ctx.model.BlogTag.findOne({ name: name })
	}

	// Commons======================================================================================================>
	async find(id) {
		return this.ctx.model.BlogTag.findById(id)
	}
}

module.exports = TagService