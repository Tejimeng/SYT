// 定义用户相关的仓库
import {defineStore} from "pinia";
import {reqCode, reqUserLogin} from '@/api/hospital/index.ts'
import type {LoginData, UserLoginResponseData, UserInfo} from '@/api/hospital/type.ts'
import type {UserState} from '@/store/modules/interface/index.ts'
import {SET_TOKEN, GET_TOKEN, REMOVE_TOKEN} from "@/utils/user.ts";

const useUserStore = defineStore('User', {
    state: (): UserState => {
        return {
            visiable: false,// 用于控制登录弹窗的显示与隐藏
            code: "",
            // 首先获取本地信息
            userInfo: JSON.parse(GET_TOKEN() as string) || ({} as UserInfo)
        }
    },
    actions: {
        async getCode(phone: string) {
            let result: any = await reqCode(phone)
            if (result.code === 200) {
                this.code = result.data
                return 'ok'
            } else {
                // 配合页面展示各种不同的结果，成功则直接展示验证码，失败则展示失败的信息
                return Promise.reject(new Error(result.message))
            }
        },
        async userLogin(data: LoginData) {
            let result: UserLoginResponseData = await reqUserLogin(data)
            // 进行登录成功或者失败的判断
            if (result.code == 200) {
                this.userInfo = result.data
                // 将登录信息进行本地储存
                SET_TOKEN(JSON.stringify(this.userInfo))
                return 'ok'
            } else {
                return Promise.reject(new Error((result.message)))
            }
        },
        logout() {
            this.userInfo = {name: "", token: ""}
            REMOVE_TOKEN()

        },
        qureyState() {
            let timer = setInterval(() => {
                if (GET_TOKEN()) {
                    this.visiable = false
                    this.userInfo = JSON.parse(GET_TOKEN() as string)
                    clearInterval(timer)
                }
            }, 1000)
        }
    },
    getters: {}
})


export default useUserStore