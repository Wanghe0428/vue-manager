# hotel-manager

## project introduce

项目制作过程：制作登陆注册页面，引入axios和md5加密，并对他们进行封装成为插件，其中还封装了防抖$debounce以及节流插件。以及设置登陆token，对基本信息进行布局，这里使用的是vue-elementUI组件进行布局页面，网站中的主题颜色是通过本地缓存localStorage进行缓存，然后自定义切换主题颜色；错误404页面统一处理；引入API层对业务进行二次封装。管理员信息管理、以及对管理员的增删改查和一些客房和顾客信息管理，这里包括一些分页功能、上传图片以及一些信息excel导出功能，还有按照条件对一些信息进行查询；引入mock.js做拦截请求，引入echars对酒店的销售额数据做成柱状图进行统计，以及权限的一些设置。

1. 使用mixin混入的方式自定义封装了一些有用的插件，比如防抖、节流插件以及axios异步请求、md5加密等插件。

2. 使用vuex状态管理将用户登录信息在保存在vuex的store库中。

3. 使用的路由模式是vue的history模式。

4. 数据的分页功能、上传图片、按条件进行查询数据、模糊查询、以及excel数据导出

5. 引入了mock.js做拦截请求

6. 引入echarts对酒店销售额数据可视化

7. 权限设置

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
