const TOKEN = Symbol('Request#token');

module.exports = {
	get queryToken() {
		// this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
		if (!this[TOKEN]) {
			const { token } = this.query;
			// 例如，从 header 中获取，实际情况肯定更复杂
			if (token) {
				this[TOKEN] = `Bearer ${token}`
			}
		}
		return this[TOKEN];
	},
	print(param) {
		console.log('============================================================================================================================================================================================================>');
		this.logger.info('some requestbody data: %j', this.request.body);
		this.logger.info('some requestQuery data: %j', this.request.query);
		this.logger.info('permissions data: %j', param);
		console.log('============================================================================================================================================================================================================>');
		// this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
	},
};