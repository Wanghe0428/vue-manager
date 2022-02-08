// 注册element-ui组件库和myPlugin插件
import Vue from 'vue'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 注册富文本插件
import VueQuillEditor from 'vue-quill-editor'

// 注册element-ui组件库
Vue.use(ElementUi);
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

// 注册myPlugin插件
import myPlugin from "./myPlugin.js"
Vue.use(myPlugin);