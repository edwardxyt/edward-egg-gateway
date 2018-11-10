const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const Service = require('egg').Service

class UploadService extends Service {

	async create(payload) {
		return this.ctx.model.Attachment.create(payload)
	}

	// destroy======================================================================================================>
	async destroy(_id) {
		const { ctx, service } = this
		const attachment = await ctx.service.v1.admin.upload.find(_id)
		if (!attachment) {
			ctx.throw(404, 'attachment not found')
		} else {
			const target = path.join(this.config.baseDir, 'app/public', `${attachment.url}`)
			try {
				// fs.unlinkSync(target) //删除文件
				await fsExtra.remove(target)
			} catch (err) {
				console.error(err)
				ctx.throw(500, err)
			}
			return ctx.model.Attachment.findByIdAndRemove(_id)
		}
	}

	// update======================================================================================================>
	// 更新前置--删除文件
	async updatePre(_id) {
		const { ctx, service } = this
		const attachment = await ctx.service.v1.admin.upload.find(_id)
		if (!attachment) {
			ctx.throw(404, 'attachment not found')
		} else {
			const target = path.join(this.config.baseDir, 'app/public/uploads/upload', `${attachment._id}${attachment.extname}`)
			try {
				// fs.unlinkSync(target) //删除文件
				await fsExtra.remove(target)
			} catch (err) {
				console.error(err)
			}
		}
		return attachment
	}

	async extra(_id, values) {
		const { ctx, service } = this
		const attachment = await ctx.service.v1.admin.upload.find(_id)
		if (!attachment) {
			ctx.throw(404, 'attachment not found')
		}
		return this.ctx.model.Attachment.findByIdAndUpdate(_id, { desc: values.desc }, { new: true })
	}

	async update(_id, values) {
		return this.ctx.model.Attachment.findByIdAndUpdate(_id, values, { new: true })
	}

	// show======================================================================================================>
	async show(_id) {
		const attachment = await this.ctx.service.v1.admin.upload.find(_id)
		if (!attachment) {
			this.ctx.throw(404, 'attachment not found')
		}
		return this.ctx.model.Attachment.findById(_id)
	}

	// index======================================================================================================>
	// 不推荐的写法，判断过多 冗余 可以直接用一条mongo语句解决，
	// 推荐column的搜索作为案例
	async index(payload) {
		// 支持全部all 无需传入kind
		// 图像kind = image ['.jpg', '.jpeg', '.png', '.gif']
		// 文档kind = document ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.csv', '.key', '.numbers', '.pages', '.pdf', '.txt', '.psd', '.zip', '.gz', '.tgz', '.gzip' ]
		// 视频kind = video ['.mov', '.mp4', '.avi']
		// 音频kind = audio ['.mp3', '.wma', '.wav', '.ogg', '.ape', '.acc']

		const attachmentKind = {
			image: ['.jpg', '.jpeg', '.png', '.gif', '.svn'],
			document: ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.csv', '.key', '.numbers', '.pages', '.pdf', '.txt', '.psd', '.zip', '.gz', '.tgz', '.gzip'],
			video: ['.mov', '.mp4', '.avi'],
			audio: ['.mp3', '.wma', '.wav', '.ogg', '.ape', '.acc']
		}

		let { currentPage = 1, pageSize = 20, isPaging = 1, search = "", kind = "" } = payload

		let res = []
		let count = 0
		let skip = ((Number(currentPage)) - 1) * Number(pageSize || 10)
		if (isPaging - 0) {
			if (search) {
				if (kind) {
					// console.log('1 开启分页 开启搜索 开启分类');
					res = await this.ctx.model.Attachment.find({ "$or": [{ "url": { $regex: search }, extname: { $in: attachmentKind[`${kind}`] } }, { "filename": { $regex: search }, extname: { $in: attachmentKind[`${kind}`] } }] })
						.skip(skip)
						.limit(Number(pageSize))
						.sort({ createdAt: -1 })
						.exec()
					count = await this.ctx.model.Attachment.countDocuments({ "$or": [{ "url": { $regex: search }, extname: { $in: attachmentKind[`${kind}`] } }, { "filename": { $regex: search }, extname: { $in: attachmentKind[`${kind}`] } }] })
						.exec()

				} else {
					// console.log('2 开启分页 开启搜索 关闭分类');
					res = await this.ctx.model.Attachment.find({ "$or": [{ "url": { $regex: search } }, { "filename": { $regex: search } }] })
						.skip(skip)
						.limit(Number(pageSize))
						.sort({ createdAt: -1 })
						.exec()
					count = await this.ctx.model.Attachment.countDocuments({ "$or": [{ "url": { $regex: search } }, { "filename": { $regex: search } }] })
						.exec()
				}
			} else {
				if (kind) {
					// console.log('3 开启分页 关闭搜索 开启分类');
					res = await this.ctx.model.Attachment.find({ extname: { $in: attachmentKind[`${kind}`] } })
						.skip(skip)
						.limit(Number(pageSize))
						.sort({ createdAt: -1 })
						.exec()
					count = await this.ctx.model.Attachment.countDocuments({ extname: { $in: attachmentKind[`${kind}`] } })
						.exec()
				} else {
					// console.log('4 开启分页 关闭搜索 关闭分类');
					res = await this.ctx.model.Attachment.find({})
						.skip(skip)
						.limit(Number(pageSize))
						.sort({ createdAt: -1 })
						.exec()
					count = await this.ctx.model.Attachment.countDocuments({})
						.exec()
				}
			}
		} else {
			if (search) {
				if (kind) {
					// console.log('5 关闭分页 开启搜索 开启分类');
					res = await this.ctx.model.Attachment.find({ "$or": [{ "url": { $regex: search }, extname: { $in: attachmentKind[`${kind}`] } }, { "filename": { $regex: search }, extname: { $in: attachmentKind[`${kind}`] } }] })
						.sort({ createdAt: -1 })
						.exec()
				} else {
					// console.log('6 关闭分页 开启搜索 关闭分类');
					res = await this.ctx.model.Attachment.find({ "$or": [{ "url": { $regex: search } }, { "filename": { $regex: search } }] })
						.sort({ createdAt: -1 })
						.exec()
				}
			} else {
				if (kind) {
					// console.log('7 关闭分页 关闭搜索 开启分类');
					res = await this.ctx.model.Attachment.find({ extname: { $in: attachmentKind[`${kind}`] } })
						.sort({ createdAt: -1 })
						.exec()
				} else {
					// console.log('8 关闭分页 关闭搜索 关闭分类');
					res = await this.ctx.model.Attachment.find({})
						.sort({ createdAt: -1 })
						.exec()
				}
			}
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

	// Commons======================================================================================================>
	async find(id) {
		return this.ctx.model.Attachment.findById(id)
	}
}

module.exports = UploadService