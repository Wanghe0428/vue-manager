import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router'
// 导入状态管理
import store from './store'
// 导入插件,导入文件就相当与执行了这个文件里的代码
import "./plugin"
//执行mock.js
import "./mock"
import Blob from './excel/Blob.js'
import Export2Excel from './excel/Export2Excel.js'
Vue.config.productionTip = false


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')