<template>
  <div class="region">
    <div class="content">
      <div class="left">地区:</div>
      <ul>
        <li :class="{active:activeFlag===''}" @click="changeRegion('')">全部</li>
        <li v-for="item in regionArr " :class="{active:activeFlag===item.value}" @click="changeRegion(item.value)" :key="item.value">{{ item.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reqHospitalLevelAndRegion} from '@/api/home/index.ts'
import type {HospitalLevelAndRegionResponseData, HospitalLevelAndRegionArr} from '@/api/home/type.ts'
import {onMounted, ref} from "vue";
// 存储地区数组
let regionArr = ref<HospitalLevelAndRegionArr>([])
// 控制地区高亮响应式数据
let activeFlag=ref<string>('')
// 地区组件的挂载
onMounted(()=>{
  getRegion()
})
const getRegion=async ()=>{
  let result:HospitalLevelAndRegionResponseData= await reqHospitalLevelAndRegion('Beijin')
  if (result.code===200){
    regionArr.value=result.data
  }
}
// 点击等级按钮的回调
const changeRegion=(region:string)=>{
  activeFlag.value=region
  $emit('getRegion',region)
}
let $emit =defineEmits(['getRegion'])
</script>

<style scoped lang="scss">
.region {
  color: #7f7f7f;
  margin-top: 10px;

  .content {
    display: flex;

    .left {
      margin-right: 10px;
      width: 50px;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      margin-left: -13px;

      li {
        margin-right: 10px;
        margin-bottom: 5px;

        &.active {
          color: #55a6fe;
        }

        &:hover {
          color: #55a6fe;
          cursor: pointer;
        }
      }
    }
  }
}
</style>