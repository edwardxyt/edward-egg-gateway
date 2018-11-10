module.exports = app => {
	const { Schema } = app.mongoose
	const connection = app.mongooseDB.get('eggGateway');

	const AttachmentSchema = new Schema({
		extname: {
			type: String,
			index: true,
		},
		url: {
			type: String,
			unique: true,
		},
		filename: {
			type: String,
			index: true,
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
		extra: { type: Schema.Types.Mixed },
	}, { timestamps: true })
	return connection.model('Attachment', AttachmentSchema)
}