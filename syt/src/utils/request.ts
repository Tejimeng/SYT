// 对axios进行二次封装
// 目的
//  1. 利用axios请求、响应拦截功能
//  2. 请求拦截器，一般可以在请求头中携带公共的参数：token
//  3. 响应拦截器，可以简化服务器返回的数据，处理http网络错误
import axios from 'axios'
// 引入element-plus中的消息弹窗组件
import {ElMessage} from "element-plus";
// 引入用户仓库用于获取token
import useUserStore from "@/store/modules/user.ts";
// 利用axios.create方法创建一个axios实例：可以设置基础路径、超时的时间的设置
const request = axios.create({
    baseURL: '/api',// 请求的基础路径设置
    timeout: 5000,// 超时时间的设置，超出5s请求就是失败的请求
})
// 请求拦截器
request.interceptors.request.use((config) => {
    let useStore=useUserStore()
    // token为公共参数，如果用户登录则需要携带才能发起相应的请求
    if (useStore.userInfo.token){
        config.headers.token=useStore.userInfo.token
    }
    //config:请求拦截器回调注入的对象（配置对象），配置对象的身上最终要的一件事情headers属性
    //可以通过请求头携带公共参数-token
    return config;
})
// 响应拦截器
request.interceptors.response.use((response) => {
    //响应拦截器成功的回调，一般会进行简化数据
    return response.data;
}, (error) => {
    // 处理http网络错误
    let status = error.response.status
    switch (status) {
        case 404:
            //         错误提示信息
            ElMessage({
                type: 'error',
                message: '请输失败，路径出现错误！'
            })
            break
        case 500 | 501 | 502 | 503 | 504 | 505:
            //         错误提示信息
            ElMessage({
                type: 'error',
                message: '请求失败，服务器响应超时！'
            })
            break
    }
    return Promise.reject(new Error(error.message))
})

export default request;