const Service = require('egg').Service

class RbacService extends Service {
	// contingency======================================================================================================>
	async contingencyRole(payload) {
		const { ctx, service } = this
		const { _id, role } = payload

		// ctx.state.user 可以提取到JWT编码的data
		// const _id = ctx.state.user.data._id
		// const user = await service.v1.admin.user.find(_id)
		// if (!user) {
		// 	ctx.throw(404, 'user is not found')
		// }

		// update写法
		// return ctx.model.User.update({
		// 	_id
		// }, {
		// 	// 覆盖一个字段
		// 	$set: {
		// 		role: payload.role
		// 	}
		// }, {
		// 	upsert: false // upsert可以指定如果数据存在就更新，不存在就创建数据。
		// })

		// model-findByIdAndUpdate写法
		return ctx.model.User.findByIdAndUpdate(_id, { $set: { role } }, { new: true })

		// 调用service写法
		// return service.v1.admin.user.update(_id, { $set: { role } }, { new: true })
	}

	async contingencyColumn(payload) {
		const { ctx, service } = this
		const { _id, column } = payload

		return ctx.model.Role.findByIdAndUpdate(_id, { $set: { column } }, { new: true })

		// 调用service写法
		// return service.v1.admin.role.update(_id, { $set: { column } }, { new: true })
	}

	async contingencyAbility(payload) {
		const { ctx, service } = this
		const { _id, ability } = payload

		return ctx.model.Column.findByIdAndUpdate(_id, { $set: { ability } }, { new: true })

		// 调用service写法
		// return service.v1.admin.column.update(_id, { $set: { ability } }, { new: true })
	}

	/**
	 * [getPermissions description]
	 * @param  {[type]}  _id [角色ID]
	 * @return {Promise}     [功能权限]
	 */
	async getPermissions(_id) {
		const { app, ctx, service } = this
		const role = await ctx.service.v1.admin.role.find(_id)
		if (!role) {
			ctx.throw(404, 'role not found')
		}

		const curd = await ctx.model.Role.findById(_id).populate({
			path: 'column',
			select: 'ability name',
			populate: {
				path: 'ability',
				select: 'name root path',
			}
		}).select('column name')

		let res = {}
		curd.column.map((item, index) => {
			item.ability.map((i, v) => {
				res[`${i.root}|${i.path}`] = true
			})
		})

		// 写入缓存
		await app.redis.set(`egg-gateway:admin:userAccess:${ctx.state.user.data._id}:permissions`, JSON.stringify(res, null, 2), 'EX', app.config.jwt.exp);

		return res
	}
}

module.exports = RbacService