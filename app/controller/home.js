'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index() {
		const { ctx } = this;
		ctx.session.name = "xiayuting"
		await ctx.render('welcome.tpl', {
			list: [
				{ url: 'http://xiayuting.cc/static/website2018/pc/accountOpenManagement/index.html', title: '企业注册登录', create_at: '2018-06-14T08:03:59.502Z' },
				{ url: 'http://xiayuting.cc/static/website2018/egg_gateway/admin/index.html', title: '综合管理台gateway', create_at: '2018-06-14T08:03:59.502Z' },
				{ url: 'http://admin.xiayuting.cc', title: ctx.session.name, create_at: '2018-06-14T08:03:59.502Z' },
			]
		});
	}
}

module.exports = HomeController;