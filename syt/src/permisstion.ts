// 路由鉴权
// 引入路由器
import router from "@/router";
import {ElLoading} from 'element-plus'
// 通过仓库中的token来实现路由守卫的设置
// 组件外部使用仓库
import useUserStore from "@/store/modules/user.ts";
import createPinia from './store/index.ts'

let userStore = useUserStore(createPinia)
// 定义未登录能够访问的路由
let whiteList = ["/home", '/hospital/register', '/hospital/detail', '/hospital/notice', '/hospital/close', '/hospital/search']
// 添加路由守卫
router.beforeEach((to, from, next) => {
    // 动态设置网页的标题
    document.title = `尚医通 - ${to.meta.title}`
    //判断用户是否登录-token
    let token = userStore.userInfo.token;
    //用户登陆了
    if (token) {
        next()
    } else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            userStore.visiable = true
            next({
                // 确保回到登录之前想去的页面
                path: '/home', query: {redirect: to.fullPath}
            })
        }

    }
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(() => {
        loading.close()
    }, 500)
})
router.afterEach((to, from) => {

})