const Service = require('egg').Service

class ColumnService extends Service {
	// create======================================================================================================>
	async create(payload) {
		const { ctx, service } = this

		const res = await ctx.model.Column.create(payload)

		const obj = {
			name: res.name,
			path: res.path,
			root: res.root,
			desc: res.desc,
			ability: res.ability,
			sort: res.sort,
			status: res.status,
			createdAt: this.ctx.helper.formatTime(res.createdAt),
			updatedAt: this.ctx.helper.formatTime(res.updatedAt),
			_id: res._id,
		}

		return obj
	}

	// destroy======================================================================================================>
	async destroy(_id) {
		const { ctx, service } = this
		const column = await ctx.service.v1.admin.column.find(_id)
		if (!column) {
			ctx.throw(404, 'column not found')
		}
		return ctx.model.Column.findByIdAndRemove(_id)
	}

	// update======================================================================================================>
	async update(_id, payload, options) {
		const { ctx, service } = this
		const column = await ctx.service.v1.admin.column.find(_id)
		if (!column) {
			ctx.throw(404, 'column not found')
		}

		// update 控制更新其他信息
		const requestBody = {
			name: payload.name,
			path: payload.path,
			root: payload.root,
			extra: payload.extra,
			desc: payload.desc,
			sort: payload.sort,
			status: payload.status,
		}

		return ctx.model.Column.findByIdAndUpdate(_id, requestBody, options)
	}

	// show======================================================================================================>
	async show(_id) {
		const column = await this.ctx.service.v1.admin.column.find(_id)

		if (!column) {
			this.ctx.throw(404, 'Column not found')
		}
		return this.ctx.model.Column.findById(_id).populate('ability')
	}

	// index======================================================================================================>
	async index(payload) {
		const { currentPage = 1, pageSize = 20, isPaging = 1, name = '', root = '', path = '' } = payload
		// 1(当前) 5（一页多少条） 1（开启分页） undefined（搜索条件）
		let res = [] //结果
		let count = 0
		let skip = (Number(currentPage) - 1) * Number(pageSize || 10) //跳页

		if (isPaging - 0) {
			// console.log('1 开启分页');
			res = await this.ctx.model.Column.find({ name: { $regex: name }, root: { $regex: root }, path: { $regex: path } })
				.populate('ability', 'name root')
				.skip(skip)
				.limit(Number(pageSize))
				.sort({ createdAt: -1 })
				.exec()
			count = await this.ctx.model.Column.countDocuments({ name: { $regex: name }, root: { $regex: root }, path: { $regex: path } })
				.exec()
		} else {
			// console.log('2 关闭分页');
			res = await this.ctx.model.Column.find({ name: { $regex: name }, root: { $regex: root }, path: { $regex: path } })
				.populate('ability', 'name root')
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
	async findByName(name) {
		return this.ctx.model.Column.findOne({ name: name })
	}
	async removes(values) {
		return this.ctx.model.Column.remove({ _id: { $in: values } })
	}

	// Commons======================================================================================================>
	async find(id) {
		return this.ctx.model.Column.findById(id)
	}
}

module.exports = ColumnService