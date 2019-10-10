# vue+vue-router+vuex+element-ui+axios

## 项目说明

``` bash
# 使用淘宝镜像install
npm --registry https://registry.npm.taobao.org install

# 运行本地环境
npm run dev

# 生产环境打包
npm run build

# 接口调用方式
接口配置在src/server/api.js中配置
使用时调用this.$api.对应配置。实例：
this.$api.decision.request(param)
.then((data) => {})
.catch((err) => {});

# ESlint 编码规范
    .eslinttrc.js文件有具体注释
    快捷键格式化ctrl+alt+l
```
#src目录说明
    components  包含所有的业务组件，要求组件尽量细化、复用，每个组件代码不能超过500行，保证可读性
    image       放置图片
    server      接口配置
    tools       路由和vuex配置
    main.js     项目入口文件
#webpack配置
    webpack.config.js  开发环境配置文件
    webpack.prod.js 生产环境配置文件