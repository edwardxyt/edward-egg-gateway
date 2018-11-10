module.exports = app => {
	const { Schema } = app.mongoose
	const connection = app.mongooseDB.get('eggGateway');

	const UserSchema = new Schema({
		mobile: {
			type: String,
			unique: true,
			required: "必填"
		},
		password: {
			type: String,
			required: "必填"
		},
		realName: {
			type: String,
			index: true,
			required: "必填"
		},
		role: [{
			type: Schema.Types.ObjectId,
			ref: 'Role'
		}],
		avatar: {
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
			default: 1
		},
		extra: { type: Schema.Types.Mixed }
	}, { timestamps: true })
	return connection.model('User', UserSchema)
}

/**
 * 在schema中设置timestamps为true
 * schema映射的文档document会自动添加createdAt和updatedAt这两个字段
 * 代表创建时间和更新时间
 */