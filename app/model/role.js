module.exports = app => {
	const { Schema } = app.mongoose
	const connection = app.mongooseDB.get('eggGateway');

	const RoleSchema = new Schema({
		name: {
			type: String,
			unique: true,
			required: "必填"
		},
		avatar: {
			type: String,
			default: 'https://1.gravatar.com/avatar/a3e54af3cb6e157e496ae430aed4f4a3?s=96&d=mm'
		},
		access: {
			type: String,
			index: true,
			required: "必填",
		},
		menu: {
			type: String,
			index: true,
			required: "必填",
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
		column: [{
			type: Schema.Types.ObjectId,
			ref: 'Column'
		}],
		extra: { type: Schema.Types.Mixed }
	}, { timestamps: true })

	return connection.model('Role', RoleSchema)
}