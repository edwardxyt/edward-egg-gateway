'use strict'
const fs = require('fs')
const fsExtra = require('fs-extra')
const send = require('koa-send');
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const Controller = require('egg').Controller

class RoleController extends Controller {
	constructor(ctx) {
		super(ctx)

		this.createRule = {
			name: { type: 'string', required: true, allowEmpty: false },
			access: { type: 'string', required: true, allowEmpty: false }
		}
	}

	// 创建角色
	async create() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.createRule)
		// 组装参数
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.role.create(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 删除单个角色
	async destroy() {
		const { ctx, service } = this
		// 校验参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		await service.v1.admin.role.destroy(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	// 修改角色
	async update() {
		const { ctx, service } = this
		// 校验参数
		ctx.validate(this.createRule)
		// 组装参数
		const { id } = ctx.params
		const payload = ctx.request.body || {}
		// 调用 Service 进行业务处理
		await service.v1.admin.role.update(id, payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	// 获取单个角色
	async show() {
		const { ctx, service } = this
		// 组装参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.role.show(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 获取所有角色(分页/模糊)
	async index() {
		const { ctx, service } = this

		// console.log(ctx.req);
		// console.log(ctx.req.Url);
		// console.log(ctx.request);

		// 组装参数
		const payload = ctx.query
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.role.index(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 删除所选角色(条件id[])
	async removes() {
		const { ctx, service } = this
		// 组装参数
		// const payload = ctx.queries.id
		const { id } = ctx.request.body

		const payload = id.split(',').filter(item => item)

		// 调用 Service 进行业务处理
		const result = await service.v1.admin.role.removes(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	// 修改项目图片
	async resetAvatar() {
		const { ctx, service } = this

		// 先将文件夹生成
		await fsExtra.ensureDir(path.join(this.config.baseDir, 'app/public/uploads/role'))

		const stream = await ctx.getFileStream()
		const filename = path.basename(stream.filename)
		const extname = path.extname(stream.filename).toLowerCase()

		// 获取Attachment表的 Entity —— 由Model创建的实体
		const attachment = new ctx.model.Attachment()
		attachment.extname = extname
		attachment.filename = filename
		attachment.url = `/uploads/role/${attachment._id.toString()}${extname}`

		// console.log(stream.fields);
		// console.log(attachment);
		const target = path.join(
			this.config.baseDir,
			'app/public/uploads/role',
			`${attachment._id.toString()}${attachment.extname}`
		)

		//创造可写流 /Users/edward/linux/egg-gateway/app/public/uploads/role/5bc215c8f7547835303bf87d.docx
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
		// stream.fields是requestBody
		const res = await service.v1.admin.role.resetAvatar(stream.fields._id, attachment)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}
}

module.exports = RoleController