const Service = require('egg').Service

class AbilityService extends Service {
	// create======================================================================================================>
	async create(payload) {
		const { ctx, service } = this

		const res = await ctx.model.Ability.create(payload)

		const obj = {
			name: res.name,
			root: res.root,
			path: res.path,
			desc: res.desc,
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
		const ability = await ctx.service.v1.admin.ability.find(_id)
		if (!ability) {
			ctx.throw(404, 'Ability not found')
		}
		return ctx.model.Ability.findByIdAndRemove(_id)
	}

	// update======================================================================================================>
	async update(_id, payload, options) {
		const { ctx, service } = this
		const ability = await ctx.service.v1.admin.ability.find(_id)
		if (!ability) {
			ctx.throw(404, 'Ability not found')
		}

		// update 控制更新其他信息
		const requestBody = {
			name: payload.name,
			root: payload.root,
			path: payload.path,
			extra: payload.extra,
			desc: payload.desc,
			sort: payload.sort,
			status: payload.status,
		}
		return ctx.model.Ability.findByIdAndUpdate(_id, requestBody, options)
	}

	// show======================================================================================================>
	async show(_id) {
		const ability = await this.ctx.service.v1.admin.ability.find(_id)

		if (!ability) {
			this.ctx.throw(404, 'Ability not found')
		}
		return this.ctx.model.Ability.findById(_id)
	}

	// index======================================================================================================>
	async index(payload) {
		const { currentPage = 1, pageSize = 20, isPaging = 1, name = '', path = '' } = payload

		let res = [] //结果
		let count = 0
		let skip = (Number(currentPage) - 1) * Number(pageSize || 10) //跳页
		if (isPaging - 0) {
			res = await this.ctx.model.Ability.find({ name: { $regex: name }, path: { $regex: path } })
				.skip(skip)
				.limit(Number(pageSize))
				.sort({ createdAt: -1 })
				.exec()
			count = await this.ctx.model.Ability.countDocuments({ name: { $regex: name }, path: { $regex: path } })
				.exec()
		} else {
			console.log('5 关闭分页 开启搜索名称 开启搜索路径');
			res = await this.ctx.model.Ability.find({ name: { $regex: name }, path: { $regex: path } })
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
		return this.ctx.model.Ability.findOne({ name: name })
	}
	async removes(values) {
		return this.ctx.model.Ability.remove({ _id: { $in: values } })
	}

	// Commons======================================================================================================>
	async find(id) {
		return this.ctx.model.Ability.findById(id)
	}
}

module.exports = AbilityService