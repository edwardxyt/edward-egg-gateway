const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const send = require('koa-send');
const Controller = require('egg').Controller
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const download = require('image-downloader')

class UploadController extends Controller {
	constructor(ctx) {
		super(ctx)
	}

	// 上传单个文件
	async create() {
		const { ctx, service } = this

		// 先将文件夹生成
		await fsExtra.ensureDir(path.join(this.config.baseDir, 'app/public/uploads/upload'))

		// 要通过 ctx.getFileStream 便捷的获取到用户上传的文件，需要满足两个条件：
		// 只支持上传一个文件。
		// 上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
		const stream = await ctx.getFileStream()
		// 所有表单字段都能通过 `stream.fields` 获取到
		const filename = path.basename(stream.filename) // 文件名称
		const extname = path.extname(stream.filename).toLowerCase() // 文件扩展名称

		// 组装参数 model
		const attachment = new ctx.model.Attachment
		attachment.extname = extname
		attachment.filename = filename
		attachment.url = `/uploads/upload/${attachment._id.toString()}${extname}`

		// 组装参数 stream
		const target = path.join(
			this.config.baseDir,
			'app/public/uploads/upload',
			`${attachment._id.toString()}${attachment.extname}`
		)

		//创造可写流
		const writeStream = fs.createWriteStream(target)

		//将可读流写入可写流
		const streamPipe = stream.pipe(writeStream);

		// 文件处理，上传到云存储等等
		try {
			await awaitWriteStream(streamPipe)
		} catch (err) {
			// 必须将上传的文件流消费掉，要不然浏览器响应会卡死
			await sendToWormhole(stream)
			throw err
		}
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.upload.create(attachment)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 通过URL添加单个图片: 如果网络地址不合法，EGG会返回500错误
	async url() {
		const { ctx, service, config } = this
		ctx.logger.info('%j', '代表我');
		ctx.logger.info('some request data: %j', ctx.request.body);
		ctx.logger.info('======================================================================================================>');

		// 先将文件夹生成
		await fsExtra.ensureDir(path.join(config.baseDir, 'app/public/uploads/upload'))

		// 组装参数
		const attachment = new ctx.model.Attachment
		const { url, name } = ctx.request.body

		const filename = path.basename(url) // 文件名称
		const extname = path.extname(url).toLowerCase() // 文件扩展名称
		const options = {
			url: url,
			dest: path.join(config.baseDir, 'app/public/uploads/upload', `${attachment._id.toString()}${extname}`)
		}
		let res

		try {
			// 写入文件 const { filename, image}
			await download.image(options)
			attachment.extname = extname
			attachment.filename = name + extname
			attachment.url = `/uploads/upload/${attachment._id.toString()}${extname}`
			res = await service.v1.admin.upload.create(attachment)
		} catch (err) {
			throw err
		}
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 上传多个文件
	async multiple() {
		// 要获取同时上传的多个文件，不能通过 ctx.getFileStream() 来获取
		const { ctx, service } = this

		// 先将文件夹生成
		await fsExtra.ensureDir(path.join(this.config.baseDir, 'app/public/uploads/upload'))

		// parts() 返回 promise 对象
		const parts = ctx.multipart()
		const res = {}
		const files = []

		let part // parts() return a promise
		while ((part = await parts()) != null) {
			if (part.length) {
				// 如果是数组的话是 filed
				// console.log('field: ' + part[0])
				// console.log('value: ' + part[1])
				// console.log('valueTruncated: ' + part[2])
				// console.log('fieldnameTruncated: ' + part[3])
			} else {
				if (!part.filename) {
					// 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
					// 需要做出处理，例如给出错误提示消息
					return
				}
				// part 是上传的文件流
				// console.log('field: ' + part.fieldname)
				// console.log('filename: ' + part.filename)
				// console.log('extname: ' + part.extname)
				// console.log('encoding: ' + part.encoding)
				// console.log('mime: ' + part.mime)
				const filename = part.filename.toLowerCase() // 文件名称
				const extname = path.extname(part.filename).toLowerCase() // 文件扩展名称

				// 组装参数
				const attachment = new ctx.model.Attachment
				attachment.extname = extname
				attachment.filename = filename
				attachment.url = `/uploads/upload/${attachment._id.toString()}${extname}`
				// const target = path.join(this.config.baseDir, 'app/public/uploads', filename)
				// 组装参数 stream
				const target = path.join(
					this.config.baseDir,
					'app/public/uploads/upload',
					`${attachment._id.toString()}${extname}`
				)

				//创造可写流
				const writeStream = fs.createWriteStream(target)

				//将可读流写入可写流
				const streamPipe = part.pipe(writeStream);

				// 文件处理，上传到云存储等等
				let res
				try {
					// result = await ctx.oss.put('egg-multipart-test/' + part.filename, part)
					await awaitWriteStream(streamPipe)
					// 调用Service
					res = await service.v1.admin.upload.create(attachment)
				} catch (err) {
					// 必须将上传的文件流消费掉，要不然浏览器响应会卡死
					await sendToWormhole(part)
					throw err
				}
				files.push({
					_id: attachment._id,
					url: attachment.url
				}) // console.log(result)
			}
		}
		ctx.helper.success({ ctx, res: { result: files } })
	}

	// 删除单个文件
	async destroy() {
		const { ctx, service } = this
		// 校验参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.upload.destroy(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 替换单个文件
	async update() {
		const { ctx, service } = this
		// 组装参数
		const { id } = ctx.params // 传入要修改的文档ID
		// 调用Service 删除旧文件，如果存在
		const attachment = await service.v1.admin.upload.updatePre(id)

		// 获取用户上传的替换文件
		const stream = await ctx.getFileStream()
		const extname = path.extname(stream.filename).toLowerCase() // 文件扩展名称
		const filename = path.basename(stream.filename) // 文件名称

		// 组装更新参数
		attachment.extname = extname
		attachment.filename = filename
		attachment.url = `/uploads/upload/${attachment._id.toString()}${extname}`
		const target_U = path.join(this.config.baseDir, 'app/public/uploads/upload', `${attachment._id}${extname}`)

		//创造可写流
		const writeStream = fs.createWriteStream(target_U)

		//将可读流写入可写流
		const streamPipe = stream.pipe(writeStream);

		// 文件处理，上传到云存储等等
		try {
			await awaitWriteStream(streamPipe)
		} catch (err) {
			// 必须将上传的文件流消费掉，要不然浏览器响应会卡死
			await sendToWormhole(stream)
			throw err
		}
		// 调用Service 保持原图片ID不变，更新其他属性
		const res = await service.v1.admin.upload.update(id, attachment)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 添加图片描述
	async extra() {
		const { ctx, service } = this
		// 组装参数
		const { id } = ctx.params // 传入要修改的文档ID
		const payload = ctx.request.body || {}
		const res = await service.v1.admin.upload.extra(id, payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 获取单个文件
	async show() {
		const { ctx, service } = this
		// 组装参数
		const { id } = ctx.params
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.upload.show(id)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res, code: 200 })
	}

	// 获取所有文件(分页/模糊)
	async index() {
		const { ctx, service } = this
		// 组装参数
		const payload = ctx.query
		// 调用 Service 进行业务处理
		const res = await service.v1.admin.upload.index(payload)
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, res })
	}

	// 删除所选文件(条件id[])
	// 这里循环删除每一条，因为要删除file文件
	async removes() {
		const { ctx, service } = this
		// 组装参数
		// const values = ctx.queries.id
		const { id } = ctx.request.body
		const payload = id.split(',').filter(i => i)

		// 设置响应内容和响应状态码
		for (let attachment of payload) {
			// 调用 Service 进行业务处理
			await service.v1.admin.upload.destroy(attachment)
		}
		// 设置响应内容和响应状态码
		ctx.helper.success({ ctx, code: 200 })
	}

	//下载
	async download() {
		const { ctx, service } = this

		// 组装参数
		const { name } = ctx.query

		// 设置一个响应头 下载与下载文件名称
		ctx.set('Content-disposition', `attachment; filename=${name}`)
		await send(ctx, name, { root: this.config.baseDir + '/app/public/uploads/upload' });
	}
}


module.exports = UploadController