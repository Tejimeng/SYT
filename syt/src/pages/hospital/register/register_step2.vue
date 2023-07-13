<template>
  <div class="container">
    <h1 class="tip">确认挂号信息</h1>
    <!--    展示就诊人信息-->
    <el-card class="box-card">
      <!--   卡片的头部   -->
      <template #header>
        <div class="card-header">
          <span>请选择就诊人</span>
          <el-button type="success" size="default" :icon="Avatar" @click="goUser">添加就诊人</el-button>
        </div>
      </template>
      <!--   卡片的身体   -->
      <div class="user">
        <Visitor @click="changeIndex(index)" class="item" v-for="(user,index) in userArr" :key="user.id" :user="user"
                 :index="index" :currentIndex="currentIndex"/>
      </div>
    </el-card>
  </div>
  <!-- 展示医生的卡片信息 -->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>挂号信息</span>
      </div>
    </template>
    <el-descriptions
        class="margin-top"
        :column="2"
        border
    >
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            就诊日期:
          </div>
        </template>
        {{ docInfo.workDate }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            就诊医院:
          </div>
        </template>
        {{ docInfo.param?.hosname }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            就诊科室:
          </div>
        </template>
        {{ docInfo.param?.depname }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            医生姓名:
          </div>
        </template>
        {{ docInfo.docname }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            医生职称:
          </div>
        </template>
        {{ docInfo.title }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            医生专长:
          </div>
        </template>
        {{ docInfo.skill }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            挂号费用:
          </div>
        </template>
        <span style="color: red">{{ docInfo.amount }}</span>
      </el-descriptions-item>
    </el-descriptions>

  </el-card>
  <!--  确定挂号按钮-->
  <div class="btn">
    <el-button @click="submitOrder" type="primary" size="default" :disabled="currentIndex==-1">
      确认挂号
    </el-button>
  </div>
</template>

<script setup lang="ts">
import {
  Avatar
} from '@element-plus/icons-vue'
// 引入组件
import Visitor from "@/components/visitor/visitor.vue";
import {reqGetUser, reqDoctorInfo} from '@/api/hospital/index.ts'
import {onMounted, ref} from "vue";
import type {UserResponseData, UserArr, DoctorInfoData, Doctor} from "@/api/hospital/type.ts";
import {useRoute, useRouter} from "vue-router";
import {reqSubmitOrder} from "@/api/user/index.ts";
import {SubmitOrder} from "@/api/user/type.ts";
import {ElMessage} from "element-plus";
// 存储用户确定就诊人的索引
let currentIndex = ref<number>(-1)
let $route = useRoute()
let $router = useRouter()
// 存储就诊人的信息
let userArr = ref<UserArr>([])
// 存储医生的信息
let docInfo = ref<Doctor>({})
// 改变点击索引的方法
const changeIndex = (index: number) => {
  currentIndex.value = index
}
// 获取就诊人的信息
const fetchUserData = async () => {
  let result: UserResponseData = await reqGetUser()
  if (result.code == 200) {
    userArr.value = result.data
  }
}
// 获取医生的信息
const fetchInfo = async () => {
  let result: DoctorInfoData = await reqDoctorInfo($route.query.docId as string)
  if (result.code == 200) {
    docInfo.value = result.data
  }
}
// 确认挂号的按钮函数，即为提交订单
const submitOrder = async () => {
  let result: SubmitOrder = await reqSubmitOrder(docInfo.value.hoscode as string, docInfo.value.id as string, userArr.value[currentIndex.value].id)
  if (result.code == 200) {
    $router.push({
      path: '/user/order',
      query: {
        orderId: result.data
      }
    })
  } else {
    ElMessage({
      type: "error",
      message: result.message
    })
  }

}
// 添加就诊人的按钮
const goUser = () => {
  $router.push({
    path: '/user/patient', query: {
      type: 'add',
    }
  })
}
onMounted(() => {
  // 获取就诊人信息
  fetchUserData()
  // 获取医生的信息
  fetchInfo()
})
</script>

<style scoped lang="scss">
.container {
  .tip {
    font-weight: 900;
    color: #7f7f7f;
    font-size: 20px;
  }

  .box-card {
    margin: 20px 0px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user {
      display: flex;
      flex-wrap: wrap;

      .item {
        width: 32%;
        margin: 5px;
      }
    }
  }

  .btn {
    display: flex;
    justify-content: center;
    margin: 10px 0px;
  }
}
</style>