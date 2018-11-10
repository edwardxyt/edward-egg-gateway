module.exports = app => {
	const { Schema } = app.mongoose
	const connection = app.mongooseDB.get('eggGateway');

	const AbilitySchema = new Schema({
		name: {
			type: String,
			index: true,
			required: "必填"
		},
		root: {
			type: String,
			required: '请填写节点名称'
		},
		path: {
			type: String,
			index: true,
			required: '请填写路径名称'
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
	return connection.model('Ability', AbilitySchema)
}

/**
 * 在schema中设置timestamps为true
 * schema映射的文档document会自动添加createdAt和updatedAt这两个字段
 * 代表创建时间和更新时间
 */