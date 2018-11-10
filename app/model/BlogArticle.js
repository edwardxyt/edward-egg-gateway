module.exports = app => {
	const { Schema } = app.mongoose
	const connection = app.mongooseDB.get('eggBlog');

	const BlogArticleSchema = new Schema({
		title: {
			type: String,
			index: true,
			required: "必填",
		},
		author: {
			type: String,
			required: "必填",
		},
		source: {
			type: String,
			default: '',
		},
		keywords: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			default: '',
		},
		count: {
			type: Number,
			default: 0,
		},
		pic: {
			type: String,
			default: 'https://1.gravatar.com/avatar/a3e54af3cb6e157e496ae430aed4f4a3?s=96&d=mm',
		},
		content: {
			type: Schema.Types.Mixed,
			required: "RAW JSON must be required!",
		},
		html: {
			type: String,
			default: '',
		},
		comments: [{
			type: Schema.Types.Mixed
		}],
		kind: [{
			type: String,
			default: '',
		}],
		codeHtml: {
			type: String,
			default: '',
		},
		codeCss: {
			type: String,
			default: '',
		},
		codeJavascript: {
			type: String,
			default: '',
		},
		codeMarkdown: {
			type: String,
			default: '',
		},
		desc: {
			type: String,
			default: '',
		},
		sort: {
			type: Number,
			default: 0,
		},
		status: {
			type: Number,
			default: 1, // 1启用 0禁用
		},
		extra: { type: Schema.Types.Mixed }
	}, { timestamps: true })
	return connection.model('BlogArticle', BlogArticleSchema)
}

/**
 * 在schema中设置timestamps为true
 * schema映射的文档document会自动添加createdAt和updatedAt这两个字段
 * 代表创建时间和更新时间
 */