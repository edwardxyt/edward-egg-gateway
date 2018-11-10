module.exports = app => {
	const { Schema } = app.mongoose
	const connection = app.mongooseDB.get('eggGateway');

	const ColumnSchema = new Schema({
		name: {
			type: String,
			index: true,
			required: "必填",
		},
		path: {
			type: String,
			unique: true,
			required: "请填写前端路由",
		},
		root: {
			type: String,
			index: true,
			required: '请填写角色节点',
		},
		ability: [{
			type: Schema.Types.ObjectId,
			ref: 'Ability',
		}],
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
			default: 1,
		},
		extra: { type: Schema.Types.Mixed }
	}, { timestamps: true })
	return connection.model('Column', ColumnSchema)
}

/**
 * 在schema中设置timestamps为true
 * schema映射的文档document会自动添加createdAt和updatedAt这两个字段
 * 代表创建时间和更新时间
 */