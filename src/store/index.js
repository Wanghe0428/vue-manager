import Vue from 'vue'
import Vuex from 'vuex'
// 导入颜色主题模块
import theme from './module/theme.js'
// 导入用户账户模块
import admin from "./module/admin.js"
Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        theme,
        admin
    },
})