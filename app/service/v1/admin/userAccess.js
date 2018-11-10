'use strict'
const Service = require('egg').Service

class UserAccessService extends Service {
	async login(payload) {
		const { app, ctx, service } = this

		const captchaToken = ctx.helper.checkCaptchaToken(payload.captchaToken)

		if (captchaToken.captchaText !== payload.captcha) {
			ctx.throw(422, '验证码错误！')
		}

		const user = await service.v1.admin.user.findByMobile(payload.mobile)

		if (!user) {
			ctx.throw(404, 'user not found')
		}
		if (!user.status) {
			ctx.throw(401, '账号已冻结！')
		}
		let verifyPsw = await ctx.compare(payload.password, user.password)
		if (!verifyPsw) {
			ctx.throw(422, 'user password is error')
		}

		// 生成Token令牌
		let token = await service.v1.admin.actionToken.apply(user._id, payload.remember)

		let loginTime = Date.now()
		let expire = app.config.jwt.exp;

		payload.remember ? expire = expire * 30 : expire

		// 写入缓存
		await app.redis.set(`egg-gateway:admin:userAccess:${user._id}:token`, token, 'EX', expire);
		await app.redis.set(`egg-gateway:admin:userAccess:${user._id}:loginTime`, loginTime, 'EX', expire);
		await app.redis.set(`egg-gateway:admin:userAccess:${user._id}:loginIP`, ctx.ip, 'EX', expire);

		return { token, loginTime, realName: user.realName }
	}

	async logout() {
		const { app, ctx, service } = this
		const _id = ctx.state.user.data._id
		// 删除缓存
		let status = await app.redis.del(`egg-gateway:admin:userAccess:${_id}:token`);
		app.redis.del(`egg-gateway:admin:userAccess:${_id}:loginTime`);
		app.redis.del(`egg-gateway:admin:userAccess:${_id}:loginIP`);
		app.redis.del(`egg-gateway:admin:userAccess:${_id}:permissions`);
		return { status }
	}

	async resetPsw(values) {
		const { app, ctx, service } = this
		// ctx.state.user 可以提取到JWT编码的data
		const _id = ctx.state.user.data._id
		const user = await service.v1.admin.user.find(_id)
		if (!user) {
			ctx.throw(404, 'user is not found')
		}

		if (values.password !== values.resetPassword) {
			ctx.throw(422, '两次密码输入不一样！')
		}

		let verifyPsw = await ctx.compare(values.oldPassword, user.password)
		if (!verifyPsw) {
			ctx.throw(422, '密码错误！')
		} else {
			// update 控制更新其他信息
			const requestBody = {
				password: await ctx.genHash(values.password)
			}

			// 写入缓存
			let status = await app.redis.del(`egg-gateway/admin/userAccess/${_id}:token`);

			return service.v1.admin.user.findByIdAndUpdate(_id, requestBody)
		}
	}

	async current() {
		const { app, ctx, service } = this
		// ctx.state.user 可以提取到JWT编码的data
		const _id = ctx.state.user.data._id
		const user = await service.v1.admin.user.show(_id)

		return user
	}

	// 修改个人信息
	async resetSelf(values) {
		const { ctx, service } = this
		// 获取当前用户
		const _id = ctx.state.user.data._id
		const user = await service.v1.admin.user.find(_id)

		if (!user) {
			ctx.throw(404, 'user is not found')
		}

		// update 控制更新其他信息
		const requestBody = {
			realName: values.realName,
			desc: values.desc,
		}
		return service.v1.admin.user.findByIdAndUpdate(_id, requestBody, { new: true, select: '_id realName desc createdAt updatedAt' })
	}

	// 更新头像
	async resetAvatar(values) {
		const { ctx, service } = this

		await service.v1.admin.upload.create(values)
		// 获取当前用户
		const _id = ctx.state.user.data._id

		const user = await service.v1.admin.user.find(_id)
		if (!user) {
			ctx.throw(404, 'user is not found')
		}

		const { avatar } = await service.v1.admin.user.findByIdAndUpdate(_id, { avatar: values.url }, { new: true })

		return {
			avatar
		}
	}
}

module.exports = UserAccessService