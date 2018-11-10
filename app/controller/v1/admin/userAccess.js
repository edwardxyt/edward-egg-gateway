'use strict'
const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const download = require('image-downloader')
const Controller = require('egg').Controller
const svgCaptcha = require('svg-captcha');

class UserAccessController extends Controller {
	constructor(ctx) {
		super(ctx)

		this.UserLoginRule = {
			mobile: { type: 'string', required: true, allowEmpty: false },
			password: { type: 'string', required: true, allowEmpty: false },
			captcha: { type: 'string', required: true, allowEmpty: false },
			captchaToken: {
				type: 'string',
				required: true,
				allowEmpty: false,
			},
		}

		this.UserResetPswRule = {
			password: { type: 'password', required: true, allowEmpty: false, min: 6 },
			oldPassword: {
				type: 'password',
				required: true,
				allowEmpty: false,
				min: 6
			}
		}

		this.UserUpdateRule = {
			realName: {
				type: 'string',
				required: true,
				allowEmpty: false,
				format: /^[\u2E80-\u9FFF]{2,6}$/
			}
		}
	}

	// 用户登入
	async login() {
		const { ctx, service } = this

		// 校验参数
		ctx.validate(this.UserLoginRule)
		// 组装参数
		const payload = ctx.request.body || {}

		// 调用 Service 进行业务处理
		const res = await service.v1.admin.userAccess.login(payload)

		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, desc: "欢迎回来", code: 101 })
	}

	// 用户登出
	async logout() {
		const { ctx, service } = this

		const res = await service.v1.admin.userAccess.logout()
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, msg: '退出成功', desc: "滚吧" })
	}

	// 图形验证码
	async captcha() {
		const { ctx, service } = this
		const { width, height } = ctx.query;

		let res = svgCaptcha.createMathExpr({
			width,
			height,
			noise: 4,
		});

		const { captchaToken, endTime } = ctx.helper.createCaptchaToken(res.text)

		// 设置响应内容和响应状态码
		ctx.helper.success({
			ctx,
			res: {
				svg: res.data,
				captchaToken,
				endTime,
				test: '我是"天上"使者',
			},
			msg: '请查收'
		})
	}

	// 修改密码
	async resetPsw() {
		const { ctx, service } = this

		// 校验参数
		ctx.validate(this.UserResetPswRule)
		// 组装参数
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		await service.v1.admin.userAccess.resetPsw(payload)
		// 登出
		await service.v1.admin.userAccess.logout()
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	// 获取用户信息
	async current() {
		const { ctx, service } = this

		const res = await service.v1.admin.userAccess.current()

		const [loginTime, loginIP] = await Promise.all([
			ctx.app.redis.get(`egg-gateway:admin:userAccess:${ctx.state.user.data._id}:loginTime`),
			ctx.app.redis.get(`egg-gateway:admin:userAccess:${ctx.state.user.data._id}:loginIP`)
		]);

		const cache = {
			loginTime: ctx.helper.fromNow(loginTime),
			loginIP
		}
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, cache })
	}

	// 修改基础信息
	async resetSelf() {
		const { ctx, service } = this

		// 校验参数
		ctx.validate(this.UserUpdateRule)
		// 组装参数
		const payload = ctx.request.body || {}
		// 调用Service 进行业务处理
		const res = await service.v1.admin.userAccess.resetSelf(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 修改头像
	async resetAvatar() {
		const { ctx, service } = this

		// 先将文件夹生成
		await fsExtra.ensureDir(path.join(this.config.baseDir, 'app/public/uploads/user'))

		const stream = await ctx.getFileStream()
		const filename = path.basename(stream.filename)
		const extname = path.extname(stream.filename).toLowerCase()

		// 获取Attachment表的 Entity —— 由Model创建的实体
		const attachment = new ctx.model.Attachment()
		attachment.extname = extname
		attachment.filename = filename
		attachment.url = `/uploads/user/${attachment._id.toString()}${extname}`

		// console.log(stream.fields);
		// console.log(attachment);
		const target = path.join(
			this.config.baseDir,
			'app/public/uploads/user',
			`${attachment._id.toString()}${attachment.extname}`
		)

		//创造可写流 /Users/edward/linux/egg-gateway/app/public/uploads/user/5bc215c8f7547835303bf87d.docx
		const writeStream = fs.createWriteStream(target)

		//将可读流写入可写流
		const streamPipe = stream.pipe(writeStream);

		try {
			// 准备流
			await awaitWriteStream(streamPipe)
		} catch (err) {
			// 必须将上传的文件流消费掉，要不然浏览器响应会卡死
			await sendToWormhole(stream)
			throw err
		}
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.userAccess.resetAvatar(attachment)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}
}

module.exports = UserAccessController