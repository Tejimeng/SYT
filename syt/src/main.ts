import {createApp} from 'vue'
// 引入清除默认样式文件
import '@/style/reset.scss'
// 引入element-plus相关的内容
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入element-plus国际化，并且忽略ts的校验
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import App from '@/App.vue'
// 引入全局组件--顶部、底部都是全局组件
import HospitalTop from '@/components/hospital_top/index.vue'
import HospitalBottom from '@/components/hospital_bottom/index.vue'
import Login from '@/components/login/index.vue'
// 引入vue-router
import router from "@/router";
// 引入仓库
import pinia from '@/store/index.ts'

const app = createApp(App)
// 注册全局组件
app.component('HospitalTop', HospitalTop)
app.component('HospitalBottom', HospitalBottom)
app.component('Login', Login)
// 组件中间件并且进行挂载
app.use(ElementPlus, {
    locale: zhCn,
})
// 引入路由守卫
import './permisstion.ts'

app.use(router).use(ElementPlus).use(pinia).mount('#app')
