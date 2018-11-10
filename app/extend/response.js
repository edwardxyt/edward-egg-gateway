// 就可以这样使用啦：this.response.foo = 'bar';
module.exports = {
	set foo(value) {
		this.set('x-response-foo', value);
	},
};