const Controller = require('egg').Controller
const R = require('ramda')

class RbacController extends Controller {
	constructor(ctx) {
		super(ctx)

		this.contingencyRoleRule = {
			role: {
				type: 'array',
				required: true,
			},
			_id: {
				type: 'string',
				required: true,
			},
		}

		this.contingencyColumnRule = {
			column: {
				type: 'array',
				required: false,
			},
			_id: {
				type: 'string',
				required: true,
			},
		}

		this.contingencyAbilityRule = {
			ability: {
				type: 'array',
				required: false,
				allowEmpty: true,
			},
			_id: {
				type: 'string',
				required: true,
				allowEmpty: true,
			},
		}
	}

	// 用户表-关联-角色表
	async contingencyRole() {
		const { ctx, service } = this

		// 校验参数
		ctx.validate(this.contingencyRoleRule)

		// 组装参数
		const payload = ctx.request.body || {}

		// 如果是数组 就直接等于
		// 如果是字符串没有逗号切割就转为数组
		// 如果是字符串还有逗号切割就转为多个数组
		if (R.is(Array, payload.role)) {
			payload.role = payload.role
		} else if (R.is(String, payload.role) && payload.role.indexOf(',') > 0) {
			payload.role = R.split(',', payload.role)
		} else {
			payload.role = [payload.role]
		}

		// 调用 Service 进行业务处理
		const res = await service.v1.admin.rbac.contingencyRole(payload)

		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 角色表-关联-栏目表
	async contingencyColumn() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.contingencyColumnRule)

		// 组装参数
		const payload = ctx.request.body || {}

		// 如果是数组 就直接等于
		// 如果是字符串没有逗号切割就转为数组
		// 如果是字符串还有逗号切割就转为多个数组
		if (R.is(Array, payload.column)) {
			payload.column = payload.column
		} else if (R.is(String, payload.column) && payload.column.indexOf(',') > 0) {
			payload.column = R.split(',', payload.column)
		} else {
			payload.column = [payload.column]
		}

		// 调用 Service 进行业务处理
		const res = await service.v1.admin.rbac.contingencyColumn(payload)

		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 栏目表-关联-功能表
	async contingencyAbility() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.contingencyAbilityRule)

		// 组装参数
		const payload = ctx.request.body || {}

		// 如果是数组 就直接等于
		// 如果是字符串没有逗号切割就转为数组
		// 如果是字符串还有逗号切割就转为多个数组

		if (R.is(Array, payload.ability)) {
			payload.ability = payload.ability
		} else if (R.is(String, payload.ability) && payload.ability.indexOf(',') > 0) {
			payload.ability = R.split(',', payload.ability)
		} else {
			payload.ability = [payload.ability]
		}

		// 调用 Service 进行业务处理
		const res = await service.v1.admin.rbac.contingencyAbility(payload)

		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 获取权限
	async getPermissions() {
		const { ctx, service } = this

		// 组装参数
		const { id } = ctx.params

		// 调用 Service 进行业务处理
		const res = await service.v1.admin.rbac.getPermissions(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}
}

module.exports = RbacController