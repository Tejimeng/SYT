<!--首页-->
<template>
  <div>
    <!--    轮播图组件-->
    <Carousel/>
    <!--    搜索框-->
    <Search/>
    <!--    具体信息部分-->
    <el-row :gutter="20">
      <el-col :span="20">
        <!--        等级子组件-->
        <Level @getLevel="getLevel" />
        <!--        地区子组件-->
        <Region @getRegion="getRegion" />
        <!--        展示医院的结构-->
        <div class="hospital" v-if="hasHospitalArr.length>0">
          <Card class="item" v-for="(item,index) in hasHospitalArr" :key="index" :hospitalInfo="item"/>
        </div>
<!--        为空则展示空组件的内容-->
        <el-empty v-else description="此筛选暂无数据" />
        <!--          分页器-->
        <el-pagination
            v-model:current-page="pageNo"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :background="true"
            layout=" prev, pager, next, jumper,->,sizes, total"
            :total="total"
            @current-change="currentChange"
            @size-change="sizeChange"
        />
      </el-col>
      <el-col :span="4">
        <Tip/>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
//引入轮播图组件
import Carousel from './carousel/index.vue'
// 引入搜索组件
import Search from './search/index.vue'
// 引入首页等级组件
import Level from './level/index.vue'
// 引入右侧组件
import Tip from './tip/index.vue'
// 引入地区组件
import Region from './region/index.vue'
// 引入医院信息组件
import Card from './card/index.vue'
import type {Content, HospitalResponseData} from '@/api/home/type.ts'
import {onMounted, ref} from "vue";
import {reqHospital} from "@/api/home";
// 分页器相关
// 分页器页码
let pageNo = ref<number>(1)
// 每页展示的数据
let pageSize = ref<number>(10)
// 存储获取到的医院数据
let hasHospitalArr = ref<Content>([])
// 医院的总个数
let total = ref<number>(0)
// 存储医院的等级相应数据
let hostype=ref<string>('')
// 存储医院的地区
let districtCode=ref<string>('')
// 初始化请求数据
onMounted(() => {
  getHospitalInfo()
})
// 获取已有医院的数据
const getHospitalInfo = async () => {
  let result: HospitalResponseData  = await reqHospital(pageNo.value, pageSize.value,hostype.value,districtCode.value)
  // console.log(result)
  if (result.code === 200) {
    hasHospitalArr.value = result.data.content
    total.value = result.data.totalElements
  }
}
// 分页器函数
const currentChange = () => {
  // console.log(pageNo);
  getHospitalInfo()
}
const sizeChange = () => {
  pageNo.value = 1
  getHospitalInfo()
}
// 自定义事件
// 收集等级参数
const getLevel=(level:string)=>{
  hostype.value=level
  getHospitalInfo()
}
// 收集地区参数
const getRegion=(region:string)=>{
  districtCode.value=region
  getHospitalInfo()
}
</script>

<style scoped lang="scss">
.hospital {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .item {
    width: 48%;
    margin: 10px 0;
  }
}
</style>