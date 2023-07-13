// 定义首页数据的ts类型
// 共有的数据类型定义
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 代表已有的医院数据的ts类型
export interface Hospital {
    "id": string,
    "createTime": string,
    "updateTime": string,
    "isDeleted": number,
    "param": {
        "hostypestring": string,
        "fullAddress": string
    },
    "hoscode": string,
    "hosname": string,
    "hostype": string,
    "provinceCode": string,
    "cityCode": string,
    "districtcode": string,
    "address": string,
    "logoData": string,
    "intro": string,
    "route": string,
    "status": number,
    "bookingRule": {
        "cycle": number,
        "releaseTime": string,
        "stopTime": string,
        "quitDay": number,
        "quitTime": string,
        "rule": string[]
    }
}

// 存储全部已有医院的数组类型
export type Content = Hospital []

// 获取已有医院接口返回的数据ts类型
export interface HospitalResponseData extends ResponseData {
    data: {
        content: Content,
        "pageable": {
            "sort": {
                "sorted": boolean,
                "unsorted": boolean,
                "empty": boolean
            },
            "pageNumber": number,
            "pagesize": number,
            "offset": number,
            "paged": boolean,
            "unpaged": boolean
        },
        "totalPages": number,
        "totalElements": number,
        "last": boolean,
        "first": boolean,
        "sort":
            {
                "sorted": boolean,
                "unsorted": boolean,
                "empty": boolean
            }
    },
    "numberofElements": number,
    "size": number,
    "number": number,
    "empty": boolean,
}

// 医院等级或者地区数据的ts类型
export interface HospitalLevelAndRegion {
    "id": number,
    "createTime": string,
    "updateTime": string,
    "isDeleted": number,
    "param": {}
    "parentId": number,
    "name": string,
    "value": string,
    "dictCode": string,
    "hasChildren": boolean,
}

// 储存返回等级或者地区约束的data约束
export type HospitalLevelAndRegionArr = HospitalLevelAndRegion[]

// 获取等级或者医院地区接口返回数据类型
export interface HospitalLevelAndRegionResponseData extends ResponseData {
    data: HospitalLevelAndRegionArr
}
// 医院列表的数据类型
export interface HospitalInfo extends ResponseData{
    data:Content,
}