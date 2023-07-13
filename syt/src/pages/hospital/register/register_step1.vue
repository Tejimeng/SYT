<template>
  <div class="wrap">
    <!--    展示顶部的数据-->
    <div class="top">
      <div class="hosname">{{ workData.baseMap?.hosname }}</div>
      <div class="line"></div>
      <div>{{ workData.baseMap?.bigname }}</div>
      <div class="dot">.</div>
      <div class="hosdeparment">{{ workData.baseMap?.depname }}</div>
    </div>
    <!--    展示具体的挂号信息-->
    <div class="center">
      <h1 class="time">{{ workData.baseMap?.workDateString }}</h1>
      <div class="container">
        <div class="item"
             :class="{active:item.status==-1||item.availableNumber==-1,cur:item.workDate==workTime.workDate}"
             v-for="item in workData.bookingScheduleList" :key="item" @click="changeTime(item)">
          <div class="top1">{{ item.workDate }}-{{ item.dayOfWeek }}</div>
          <div class="bottom">
            <div v-if="item.status==-1">
              停止挂号
            </div>
            <div v-if="item.status==0">
              {{ item.availableNumber == -1 ? "约满了" : `有号(${item.availableNumber})` }}
            </div>
            <div v-if="item.status==1">
              即将放号
            </div>
          </div>
        </div>
      </div>
      <el-pagination layout="prev, pager, next" :total="workData.total"
                     v-model:current-page="pageNo"
                     @current-change="fetchWorkData"
      />
    </div>
    <!--    展示挂号医生的信息-->
    <div class="bottom">
      <!--      未放号的区域信息展示-->
      <div class="will" v-if="workTime.status==1">
        <span class="time">即将放号，</span>
        <span class="willText">请等待~</span>
      </div>
      <!--     已经放号，展示可以挂号医生信息-->
      <div class="doctor" v-else>
        <!--        上午号源-->
        <div class="moring">
          <!--        顶部文字的提示-->
          <div class="tip">
            <svg t="1688897098372" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="1673" width="32" height="32">
              <path
                  d="M904.101037 676.946871H118.670712c-15.461511 0-28.105271-12.535384-28.105271-28.033021 0-15.461511 12.643759-28.105271 28.105271-28.10527h785.430325c15.461511 0 28.105271 12.643759 28.105271 28.10527s-12.607634 28.033021-28.105271 28.033021z m-56.029916-324.980738c-11.018133 10.945883-28.719396 10.945883-39.665279 0-11.018133-10.945883-11.018133-28.755521 0-39.665279l39.665279-39.665279a27.97522 27.97522 0 0 1 39.593029 0 27.93187 27.93187 0 0 1 0 39.665279l-39.593029 39.665279z m-62.279545 212.776406c-26.082269-128.027094-138.683977-224.444789-274.441826-224.44479-135.649474 0-248.287307 96.417696-274.369576 224.44479H177.915755c21.602766-158.263741 162.454244-280.583081 333.433995-280.583081 171.088125 0 311.903478 122.31934 333.506244 280.583081h-59.064418z m-274.441826-336.612997c-15.461511 0-28.033021-12.535384-28.033021-28.10527V143.95823c0-15.461511 12.535384-28.105271 28.033021-28.10527 15.569886 0 28.105271 12.643759 28.10527 28.10527v56.029916c0 15.606011-12.535384 28.141396-28.10527 28.141396zM174.700628 351.966133L135.035349 312.264729c-10.945883-10.945883-10.945883-28.755521 0-39.665279 11.018133-10.945883 28.719396-10.945883 39.665279 0l39.665279 39.665279a27.93187 27.93187 0 0 1 0 39.665279c-10.909758 10.982008-28.647146 10.982008-39.665279 0.036125z m-28.033021 381.119029h729.40041c15.497636 0 28.033021 12.535384 28.03302 28.03302a28.033021 28.033021 0 0 1-28.03302 28.033021H146.667607c-15.497636 0-28.033021-12.535384-28.03302-28.033021 0.036125-15.497636 12.571509-28.033021 28.03302-28.03302z m84.171312 112.168207h561.093911c15.497636 0 28.033021 12.535384 28.033021 28.033021 0 15.569886-12.535384 28.105271-28.033021 28.10527H230.838919c-15.497636 0-28.033021-12.535384-28.03302-28.10527 0-15.497636 12.535384-28.033021 28.03302-28.033021z"
                  fill="#1296db" p-id="1674"></path>
            </svg>
            <span class="text">上午号源</span>
          </div>
          <!--          就诊医生的信息-->
          <div class="doc_info" v-for="doctor in morimgArr" :key="doctor.id">
            <div class="left">
              <div class="info">
                <span>{{ doctor.title }}</span>
                <span>|</span>
                <span>{{ doctor.docname ? doctor.docname : "安排中~" }}</span>
              </div>
              <div class="skill">{{ doctor.skill }}</div>
            </div>
            <div class="right">
              <div class="money">￥{{ doctor.amount }}</div>
              <el-button type="primary" size="default" @click="goStep2(doctor)">剩余{{
                  doctor.availableNumber
                }}
              </el-button>
            </div>
          </div>
        </div>
        <!--        下午号源-->
        <div class="moring">
          <div class="tip">
            <svg t="1688897183974" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="2519" width="32" height="32">
              <path
                  d="M740.864 503.808c-10.24 0-19.456-6.144-23.552-15.872-11.776-27.648-27.648-53.76-47.616-76.288-9.216-10.752-8.192-26.624 2.56-36.352 10.752-9.216 26.624-8.192 36.352 2.56 23.552 27.136 42.496 57.344 56.32 90.112 5.632 12.8-0.512 28.16-13.824 33.28-3.584 1.536-6.656 2.56-10.24 2.56zM456.192 931.84c-184.32 0-334.336-150.016-334.336-334.336 0-80.384 28.672-157.696 81.408-218.624 9.216-10.752 25.6-11.776 36.352-2.56 10.752 9.216 11.776 25.6 2.56 36.352-44.544 51.2-68.608 117.248-68.608 184.832 0 156.16 126.976 283.136 283.136 283.136 134.144 0 251.392-96.256 278.016-228.864 2.56-13.824 16.384-23.04 30.208-19.968 13.824 2.56 23.04 16.384 19.968 30.208C752.64 818.176 614.4 931.84 456.192 931.84z"
                  fill="#1296db" p-id="2520"></path>
              <path
                  d="M766.464 676.864c-3.072 0-6.144 0-9.216-0.512-13.824-1.536-24.576-13.824-23.04-28.16 1.536-13.824 13.824-24.064 28.16-23.04 4.608 0.512 10.752 0 16.896-0.512h2.56c16.384-1.024 31.744-8.704 42.496-20.992 10.752-12.288 15.872-28.16 14.848-44.544-1.024-16.384-8.704-31.232-20.992-41.984-12.288-10.752-28.16-15.872-45.056-14.848-9.728 0.512-14.336 1.536-19.456 4.096-12.8 5.632-28.16 0-33.792-12.8-5.632-12.8 0-28.16 12.8-33.792 12.288-5.632 23.04-7.68 36.864-8.192 30.208-2.048 59.392 7.68 81.92 27.136 23.04 19.456 36.864 47.104 38.912 77.312 2.048 30.208-7.68 58.88-27.136 81.92-19.968 22.528-47.104 36.352-77.312 38.912h-2.56c-5.632-0.512-11.264 0-16.896 0zM699.392 404.992H206.848c-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6h492.544c14.336 0 25.6 11.264 25.6 25.6s-11.776 25.6-25.6 25.6zM289.28 341.504c-10.24 0-19.968-6.656-24.064-16.896-5.12-13.312 2.048-28.16 15.36-32.768 1.024-0.512 3.072-3.584 4.096-8.192 3.072-14.336-2.56-37.888-16.384-51.2-14.336-13.312-21.504-30.72-22.016-49.664-0.512-41.984 34.816-79.36 38.912-83.456 9.728-10.24 26.112-10.24 36.352 0 10.24 9.728 10.24 26.112 0.512 36.352-6.656 6.656-24.576 29.184-24.576 46.592 0 5.12 2.048 9.216 6.144 13.312 25.088 24.064 37.888 64.512 30.72 98.816-4.608 22.528-17.92 38.912-36.352 45.568-3.072 1.024-5.632 1.536-8.704 1.536zM650.24 341.504c-10.24 0-19.968-6.656-24.064-16.896-5.12-13.312 2.048-28.16 15.36-32.768 1.024-0.512 3.072-3.584 4.096-8.192 3.072-14.336-2.56-37.888-16.384-51.2-14.336-13.312-21.504-30.72-22.016-49.664-0.512-41.984 34.816-79.36 38.912-83.456 9.728-10.24 26.112-10.24 36.352-0.512s10.24 26.112 0.512 36.352c-6.656 6.656-24.576 29.184-24.576 46.592 0 5.12 2.048 9.216 6.144 13.312 25.088 24.064 37.888 64.512 30.72 98.816-4.608 22.528-17.92 38.912-36.352 45.568-3.072 1.536-6.144 2.048-8.704 2.048zM453.12 285.184c-10.24 0-19.968-6.656-24.064-16.896-4.096-10.24-0.512-22.016 7.68-28.672-0.512-2.048-1.536-4.608-2.56-6.144C424.96 225.28 419.84 214.016 419.84 201.728c-0.512-23.552 17.408-43.008 20.992-46.592 9.728-10.24 26.112-10.24 36.352-0.512s10.24 26.112 0.512 35.84c-2.048 2.56-4.608 5.632-5.632 8.192 12.8 14.336 18.944 35.328 14.848 53.76-3.072 14.848-12.288 25.6-25.088 30.72-3.072 1.536-5.632 2.048-8.704 2.048z"
                  fill="#1296db" p-id="2521"></path>
            </svg>
            <span class="text">下午号源</span>
          </div>
          <!--          就诊医生的信息-->
          <div class="doc_info" v-for="doctor in afterArr" :key="doctor.id">
            <div class="left">
              <div class="info">
                <span>{{ doctor.title }}</span>
                <span>|</span>
                <span>{{ doctor.docname ? doctor.docname : "安排中~" }}</span>
              </div>
              <div class="skill">{{ doctor.skill }}</div>
            </div>
            <div class="right">
              <div class="money">￥{{ doctor.amount }}</div>
              <!--       在跳转时携带医生的信息       -->
              <el-button type="primary" size="default" @click="goStep2(doctor)">剩余{{
                  doctor.availableNumber
                }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {reqHospitalWork, reqHospitalDoctor} from '@/api/hospital/index.ts'
import {DocArr, Doctor, DoctorResponseData, HospitalWordData} from "@/api/hospital/type.ts";

let $route = useRoute()
let $router = useRouter()
// 分页器当前的页码
let pageNo = ref<number>(1)
// 每一页展示的数据
let limit = ref<number>(6)
// 存储科室挂号的数据
let workData = ref<any>({})
// 存储排班日期：当前数据的第一个
let workTime = ref<any>({})
// 存储排班医生的数据
let docArr = ref<DocArr>([])
// 获取科室数据的方法
const fetchWorkData = async () => {
  let result: HospitalWordData = await reqHospitalWork(pageNo.value, limit.value, $route.query.hoscode as string, $route.query.depcode as string)
  if (result.code == 200) {
    workData.value = result.data
    workTime.value = workData.value.bookingScheduleList[0]
    // 获取一次首日医生的排班信息
    getDoctorWork()
  }
}
// 获取某一天医生排班的数据
const getDoctorWork = async () => {
  let result: DoctorResponseData = await reqHospitalDoctor($route.query.hoscode as string, $route.query.depcode as string, workTime.value.workDate)
  if (result.code == 200) {
    docArr.value = result.data
  }
}
// 点击获取排班的数据
const changeTime = (item: any) => {
  workTime.value = item
  getDoctorWork()
}
// 对医生的工作时间进行分类
// 上午
let morimgArr = computed(() => {
  return docArr.value.filter((doc: Doctor) => {
    return doc.workTime == 0
  })
})
// 下午
let afterArr = computed(() => {
  return docArr.value.filter((doc: Doctor) => {
    return doc.workTime == 1
  })
})
// 挂号界面跳转
const goStep2 = (doctor: Doctor) => {
  // 进行路由的跳转
  $router.push({path: '/hospital/register_step2', query: {docId: doctor.id}})
}
// 在挂载时进行初次数据请求
onMounted(() => {
  fetchWorkData()
})
</script>

<style scoped lang="scss">
.wrap {
  .top {
    display: flex;
    color: #7f7f7f;

    .line {
      width: 5px;
      height: 20px;
      background: skyblue;
      margin: 0px 5px;
    }

    .dot {
      margin: 0px 5px;
      color: skyblue;
    }
  }

  .center {
    margin: 20px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .time {
      font-weight: 900;
    }

    .container {
      width: 100%;
      display: flex;
      margin: 30px 0px;

      .item {
        flex: 1;
        width: 100%;
        border: 1px solid skyblue;
        margin: 0px 10px;
        transition: all 0.3s;

        &.active {
          border: 1px solid #ccc;
          color: #7f7f7f;

          .top1 {
            background: #ccc;
          }
        }

        &.cur {
          transform: scale(1.1);
        }

        .top1 {
          background: #e8f2ff;
          height: 30px;
          width: 100%;
          text-align: center;
          line-height: 30px;
        }

        .bottom {
          width: 100%;
          height: 60px;
          text-align: center;
          line-height: 60px;
        }
      }
    }
  }

  .bottom {
    .will {
      text-align: center;
      font-size: 30px;
      font-weight: 900;

      .time {
        color: red;
      }

      .willText {
        color: skyblue;
      }
    }

    .doctor {
      .moring {
        .tip {
          display: flex;
          align-items: center;

          .text {
            color: #7f7f7f;
            font-weight: 900;
          }
        }

        .doc_info {
          display: flex;
          justify-content: space-between;
          margin: 10px 0px;
          border-bottom: 1px solid #ccc;

          .left {
            .info {
              color: skyblue;
              margin: 10px 0px;

              span {
                margin: 0px 5px;
                font-size: 18px;
                font-weight: 900;
              }
            }

            .skill {
              margin: 10px 0px;
              color: #7f7f7f;
            }
          }

          .right {
            width: 150px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .money {
              color: #7f7f7f;
              font-weight: 900;
            }
          }
        }
      }
    }
  }
}
</style>