'use strict'

const Service = require('egg').Service

class ActionTokenService extends Service {
	async apply(_id, remember) {
		const { app, ctx } = this
		let expire = app.config.jwt.exp;
		let now = Math.floor(Date.now() / 1000)

		// 30天
		remember ? expire = expire * 30 : expire
		return ctx.app.jwt.sign({
			data: {
				_id: _id
			},
			exp: now + expire,
			iat: now - 30 + expire,
		}, ctx.app.config.jwt.secret)
	}
}

module.exports = ActionTokenService