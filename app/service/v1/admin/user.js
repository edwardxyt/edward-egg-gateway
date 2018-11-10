const Service = require('egg').Service

class UserService extends Service {
	// create======================================================================================================>
	async create(payload, status) {
		const { ctx, service } = this
		const captchaToken = ctx.helper.checkCaptchaToken(payload.captchaToken)

		if (captchaToken.captchaText !== payload.captcha) {
			ctx.throw(401, '验证码错误！')
		}

		payload.password = await ctx.genHash(payload.password)
		payload.status = status

		const res = await ctx.model.User.create(payload)

		const obj = {
			desc: res.desc,
			mobile: res.mobile,
			realName: res.realName,
			sort: res.sort,
			status: res.status,
			createdAt: ctx.helper.formatTime(res.createdAt),
			updatedAt: ctx.helper.formatTime(res.updatedAt),
			_id: res._id,
		}

		return obj
	}

	// destroy======================================================================================================>
	async destroy(_id) {
		const { ctx, service } = this
		const user = await ctx.service.v1.admin.user.find(_id)
		if (!user) {
			ctx.throw(404, 'user not found')
		}
		return ctx.model.User.findByIdAndRemove(_id)
	}

	// update======================================================================================================>
	async update(_id, payload, options) {
		const { ctx, service } = this
		const user = await ctx.service.v1.admin.user.find(_id)
		if (!user) {
			ctx.throw(404, 'user not found')
		}

		// update 控制更新其他信息
		const requestBody = {
			realName: payload.realName,
			avatar: payload.avatar,
			extra: payload.extra,
			desc: payload.desc,
			sort: payload.sort,
			status: payload.status,
		}

		return ctx.model.User.findByIdAndUpdate(_id, requestBody, options)
	}

	// resetPassword======================================================================================================>
	async resetPassword(_id, payload) {
		const { app, ctx, service } = this
		const user = await ctx.service.v1.admin.user.find(_id)
		if (!user) {
			ctx.throw(404, 'user not found')
		}

		const res = ctx.model.User.findByIdAndUpdate(_id, { password: payload.password, }, { new: true })

		let status
		if (res) {
			// 删除缓存
			status = await app.redis.del(`egg-gateway:admin:userAccess:${_id}:token`);
			app.redis.del(`egg-gateway:admin:userAccess:${_id}:loginTime`);
			app.redis.del(`egg-gateway:admin:userAccess:${_id}:loginIP`);
			app.redis.del(`egg-gateway:admin:userAccess:${_id}:permissions`);

		}

		return { status }
	}

	// show======================================================================================================>
	async show(_id) {
		const user = await this.ctx.service.v1.admin.user.find(_id)
		if (!user) {
			this.ctx.throw(404, 'user not found')
		}
		return this.ctx.model.User.findById(_id).populate({
			path: 'role',
			select: 'name access menu avatar desc sort status createdAt',
			populate: {
				path: 'column',
				select: 'name root path desc sort status',
				// populate: {
				// 	path: 'ability',
				// 	select: 'name root path desc sort status',
				// }
			}
		}).select('realName mobile avatar desc status sort createdAt updatedAt')
	}

	// index======================================================================================================>
	async index(payload) {
		const { currentPage = 1, pageSize = 20, isPaging = 1, search = "" } = payload
		let res = []
		let count = 0
		let skip = (Number(currentPage) - 1) * Number(pageSize || 10)
		if (isPaging - 0) {
			console.log('1 开启分页');
			res = await this.ctx.model.User.find({ "$or": [{ "mobile": { $regex: search } }, { "realName": { $regex: search } }] })
				.populate('role', 'name access menu desc avatar')
				.select('realName mobile avatar desc status sort createdAt updatedAt')
				.skip(skip)
				.limit(Number(pageSize))
				.sort({ createdAt: -1 })
				.exec()
			count = await this.ctx.model.User.countDocuments({ "$or": [{ "mobile": { $regex: search } }, { "realName": { $regex: search } }] })
				.exec()
		} else {
			console.log('2 开启分页');
			res = await this.ctx.model.User.find({ "$or": [{ "mobile": { $regex: search } }, { "realName": { $regex: search } }] })
				.populate('role', 'name access menu desc avatar')
				.select('realName mobile avatar desc status sort createdAt updatedAt')
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

	async removes(payload) {
		return this.ctx.model.User.remove({ _id: { $in: payload } })
	}

	// Commons======================================================================================================>
	async findByMobile(mobile) {
		return this.ctx.model.User.findOne({ mobile: mobile })
	}

	async find(id) {
		return this.ctx.model.User.findById(id)
	}

	async findByIdAndUpdate(id, values, options) {
		return this.ctx.model.User.findByIdAndUpdate(id, values, options)
	}
}

module.exports = UserService