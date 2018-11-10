module.exports = app => {
	const { Schema } = app.mongoose
	const connection = app.mongooseDB.get('eggBlog');

	const BlogTagSchema = new Schema({
		name: {
			type: String,
			unique: true,
			required: "必填"
		},
		pic: {
			type: String,
			default: 'https://1.gravatar.com/avatar/a3e54af3cb6e157e496ae430aed4f4a3?s=96&d=mm'
		},
		desc: {
			type: String,
			default: ''
		},
		sort: {
			type: Number,
			default: 0
		},
		status: {
			type: Number,
			default: 1 // 1启用 0禁用
		},
		extra: { type: Schema.Types.Mixed }
	}, { timestamps: true })
	return connection.model('BlogTag', BlogTagSchema)
}

/**
 * 在schema中设置timestamps为true
 * schema映射的文档document会自动添加createdAt和updatedAt这两个字段
 * 代表创建时间和更新时间
 */