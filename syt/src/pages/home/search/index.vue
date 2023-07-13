<!--搜索框组件-->
<template>
  <div class="search">
    <el-autocomplete
        v-model="hosname"
        clearable
        placeholder="请输入医院名称"
        :fetch-suggestions="fetchData"
        :trigger-on-focus="false"
        @select="goDetail"
    />
    <el-button type="primary" size="default" :icon="Search"></el-button>
  </div>
</template>

<script setup lang="ts">
//引入图标
import {Search} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {reqHospitalInfo} from '@/api/home/index.ts'
import type {HospitalInfo, Content} from '@/api/home/type.ts'
// 创建路由器对象
let $router = useRouter()
// 收集搜索的关键字
let hosname = ref<string>('')
// 搜索框的回调，输入文字之后发起请求
const fetchData = async (keyword: string, cb: any) => {
  let result: HospitalInfo = await reqHospitalInfo(keyword)
  //  根据组件的回调函数来创建相应的展示数据
  let showData = result.data.map(item => {
    return {
      value: item.hosname, // 展示的医院的名字
      hoscode: item.hoscode // 展示医院的代码，用于之后的点击路由跳转
    }
  })
  // 组件内置的回调函数
  cb(showData)
}
// 点击选项列表中的选项处理函数
const goDetail = (item: any) => {
//   进入路由的跳转
  $router.push({path: "/hospital/register",query:{hoscode:item.hoscode}})
}
</script>

<style scoped lang="scss">
//深度选择器：>>>   /deep/   ::v-deep
.search {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;

  :deep(.el-input__wrapper) {
    width: 800px;
    margin-right: 10px;
  }
}
</style>