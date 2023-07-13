import {defineStore} from 'pinia'
import {reqHospitalDetail, reqHospitalDeparment} from "@/api/hospital/index.ts";
import type {HospitalDetail, DeparmentResponseData} from "@/api/hospital/type.ts";
import type {DetailState} from "@/store/modules/interface/index.ts"

const useDetailStore = defineStore('Detail', {
    state: (): DetailState => {
        return {
            //     医院的详情数据
            hospitalInfo: ({} as HospitalDetail),
            deparmentArr: ({} as DeparmentResponseData)
        }
    },
    actions: {
        async getHospital(hoscode: string) {
            let result: HospitalDetail = await reqHospitalDetail(hoscode)
            if (result.code === 200) {
                this.hospitalInfo = result.data
                // console.log(this.hospitalInfo)
            }
        },
        async getDeparment(hoscode: string) {
            let result: any = await reqHospitalDeparment(hoscode)
            if (result.code === 200) {
                this.deparmentArr = result.data
            }
        }
    },
    getters: {}
})
// 向外暴露
export default useDetailStore