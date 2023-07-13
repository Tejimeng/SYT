// pinia仓库中数据的ts类型文件
import type {HospitalDetail,DeparmentArr,UserInfo} from "@/api/hospital/type.ts";
// 定义医院仓库内部存储数据state的ts类型
export interface DetailState{
    hospitalInfo:HospitalDetail
    deparmentArr:DeparmentArr
}
// 定义用户仓库内部存储数据state的ts类型
export interface UserState{
    visiable:boolean,
    code:string,
    userInfo:UserInfo
}