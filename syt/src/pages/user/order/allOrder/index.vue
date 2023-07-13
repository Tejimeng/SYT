<template>
  <!-- 展示全部订单的结构 -->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>挂号订单</span>
      </div>
    </template>
    <!--提供用户选择的下拉菜单-->
    <el-form :inline="true">
      <el-form-item label="就诊人">
        <el-select placeholder="请选择就诊人" v-model="patientId" @change="changeUser">
          <!--          空字符串为获取所有人的就诊信息-->
          <el-option label="请选择全部就诊人" value=""></el-option>
          <el-option
              v-for="item in allUser"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select placeholder="请选择订单状态" v-model="orderStatus" @change="changeOrderState">
          <!--          空字符串为获取所有订单状态的就诊信息-->
          <el-option label="全部订单" value=""></el-option>
          <el-option v-for="(item,index) in allOrderState" :key="index" :label="item.comment"
                     :value="item.status"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 表格展示订单的数据 -->
    <el-table border style="margin: 10px 0px" :data="allOrderArr">
      <el-table-column label="就诊时间" prop="reserveDate"></el-table-column>
      <el-table-column label="医院" prop="hosname"></el-table-column>
      <el-table-column label="科室" prop="depname"></el-table-column>
      <el-table-column label="医生" prop="title"></el-table-column>
      <el-table-column label="服务费" prop="amount"></el-table-column>
      <el-table-column label="就诊人" prop="patientName"></el-table-column>
      <el-table-column label="订单状态" prop="param.orderStatusString"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button type="text" @click="goDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getOrderInfo"
        @size-change="handler"
    />
  </el-card>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {reqUserOrderInfo, reqAllUser, reqOrderState} from "@/api/user";
import type {
  AllOrderState,
  AllUser,
  AllOrderStateResponseData,
  AllUserResponseData,
  UserOrderInfoResponseData,
  Records
} from "@/api/user/type.ts";
import {useRouter} from "vue-router";

let $router = useRouter()
// 当前的页码
let pageNo = ref<number>(1)
// 当前的页码展示几条数据
let pageSize = ref<number>(10)
// 就诊人的id值
let patientId = ref<string>('')
// 订单的状态
let orderStatus = ref<string>('')
// 存储全部的订单
let allOrderArr = ref<Records>([])
// 存储所有就诊人的信息
let allUser = ref<AllUser>([])
// 全部订单的状态
let allOrderState = ref<AllOrderState>([])
// 总个数
let total = ref<number>(0)
// 获取所有的订单数据
const getOrderInfo = async (pager: number = 1) => {
  pageNo.value = pager
  let result: UserOrderInfoResponseData = await reqUserOrderInfo(pageNo.value, pageSize.value, patientId.value, orderStatus.value)
  if (result.code) {
    allOrderArr.value = result.data.records
    total.value = result.data.total
  }
}
// 获取就诊人和订单的状态
const getData = async () => {
  // 就诊人信息
  let result: AllUserResponseData = await reqAllUser()
  allUser.value = result.data
  // 订单信息
  let result1: AllOrderStateResponseData = await reqOrderState()
  allOrderState.value = result1.data
}
// 详情跳转
const goDetail = (row: any) => {
  $router.push({path: '/user/order', query: {orderId: row.id}})
}
const handler = (pageSizes: number) => {
  pageSize.value = pageSizes
  getOrderInfo()
}
// 获取某个就诊人的信息
const changeUser = () => {
  // 根据就诊人的ID再次获取数据
  getOrderInfo()
}
// 获取订单状态的信息
const changeOrderState = () => {
// 根据就诊人的状态再次获取数据
  getOrderInfo()
}
onMounted(() => {
  // 获取全部的订单
  getOrderInfo()
  // 获取全部的就诊人和获取所有订单的支付状态
  getData()
})
</script>

<style scoped></style>
