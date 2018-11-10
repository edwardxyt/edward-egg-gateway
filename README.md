# egg-gateway

nodeJS server

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

## 说明

内置一套RBAC接口与 上传下载文件管理。
代码就不详情说明了，学习请看官方文档。中文易懂的。
这里需要说明一下，配置文件里需要你自己安装mongodb redis 配置 密码或地址。
微信功能 阿里node性能平台 如果不用需要注释掉。
访问需要跨域等 需要白名单配置，尽量使用nginx代理。

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7002/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

-   Use `npm run lint` to check code style.
-   Use `npm test` to run unit test.
-   Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org
