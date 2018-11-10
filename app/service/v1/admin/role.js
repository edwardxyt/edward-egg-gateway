const Service = require('egg').Service

class RoleService extends Service {
	// create======================================================================================================>
	async create(payload) {
		const { ctx, service } = this

		const res = await ctx.model.Role.create(payload)

		const obj = {
			name: res.name,
			access: res.access,
			menu: res.menu,
			desc: res.desc,
			mobile: res.mobile,
			column: res.column,
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
		const role = await ctx.service.v1.admin.role.find(_id)
		if (!role) {
			ctx.throw(404, 'role not found')
		}
		return ctx.model.Role.findByIdAndRemove(_id)
	}

	// update======================================================================================================>
	async update(_id, payload, options) {
		const { ctx, service } = this
		const role = await ctx.service.v1.admin.role.find(_id)
		if (!role) {
			ctx.throw(404, 'role not found')
		}

		// update 控制更新其他信息
		const requestBody = {
			name: payload.name,
			avatar: payload.avatar,
			access: payload.access,
			menu: payload.menu,
			extra: payload.extra,
			desc: payload.desc,
			sort: payload.sort,
			status: payload.status,
		}

		return ctx.model.Role.findByIdAndUpdate(_id, requestBody, options)
	}

	// show======================================================================================================>
	async show(_id) {
		const role = await this.ctx.service.v1.admin.role.find(_id)
		if (!role) {
			this.ctx.throw(404, 'role not found')
		}
		return this.ctx.model.Role.findById(_id).populate({
			path: 'column',
			select: 'name root path desc sort status',
			// populate: {
			// 	path: 'ability',
			// 	select: 'name root path desc sort status',
			// }
		})
	}

	// index======================================================================================================>
	async index(payload) {
		const { currentPage = 1, pageSize = 20, isPaging = 1, search = "", access = "", } = payload

		let res = [] //结果
		let count = 0
		let skip = (Number(currentPage) - 1) * Number(pageSize || 10) //跳页
		if (isPaging - 0) {
			console.log('1 开启分页');
			res = await this.ctx.model.Role.find({ name: { $regex: search }, access: { $regex: access } })
				.populate('column', 'name root path')
				.select('name access menu avatar desc status sort createdAt updatedAt')
				.skip(skip)
				.limit(Number(pageSize))
				.sort({ createdAt: -1 })
				.exec()
			count = await this.ctx.model.Role.countDocuments({ name: { $regex: search }, access: { $regex: access } })
				.exec()
		} else {
			res = await this.ctx.model.Role.find({ name: { $regex: search }, access: { $regex: access } })
				.populate('column', 'name root path')
				.select('name access menu avatar desc status sort createdAt updatedAt')
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

	// 更新头像
	async resetAvatar(_id, values) {
		const { ctx, service } = this

		// 写入图片表
		await service.v1.admin.upload.create(values)

		const role = await service.v1.admin.role.find(_id)
		if (!role) {
			ctx.throw(404, 'role is not found')
		}

		// 更新角色头像
		const { avatar } = await service.v1.admin.role.findByIdAndUpdate(_id, { avatar: values.url }, { new: true })

		return {
			avatar
		}
	}

	// removes======================================================================================================>
	async removes(values) {
		return this.ctx.model.Role.remove({ _id: { $in: values } })
	}

	// Commons======================================================================================================>
	async findByName(name) {
		return this.ctx.model.Role.findOne({ name: name })
	}
	async find(id) {
		return this.ctx.model.Role.findById(id)
	}

	async findByIdAndUpdate(id, values, options) {
		return this.ctx.model.Role.findByIdAndUpdate(id, values, options)
	}
}

module.exports = RoleService