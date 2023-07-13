<template>
  <div class="level">
    <h1>医院</h1>
    <div class="content">
      <div class="left">等级:</div>
      <ul class="hospital">
        <li :class="{active:activeFlag===''}" @click="changeLevel('')">全部</li>
        <li v-for="(value) in levelArr" :class="{active:activeFlag===value.value}" :key="value.value" @click="changeLevel(value.value)">{{value.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reqHospitalLevelAndRegion} from '@/api/home/index.ts'
import type {HospitalLevelAndRegionResponseData, HospitalLevelAndRegionArr} from '@/api/home/type.ts'
import {onMounted, ref} from "vue";

// 储存医院等级数据的数组
let levelArr = ref<HospitalLevelAndRegionArr>([])
// 控制医院等级高亮响应式数据
let activeFlag=ref<string>('')
onMounted(() => {
  getLevel()
})
// 获取医院等级的数据的函数
const getLevel = async () => {
  let result: HospitalLevelAndRegionResponseData = await reqHospitalLevelAndRegion('Hostype')
  if (result.code===200){
    levelArr.value=result.data
  }
}
// 点击等级按钮的回调
const changeLevel=(level:string)=>{
  activeFlag.value=level
  $emit('getLevel',level)
}
let $emit =defineEmits(['getLevel'])
</script>

<style scoped lang="scss">
.level {
  color: #7f7f7f;

  h1 {
    font-weight: 900;
    margin: 10px 0;
  }

  .content {
    display: flex;

    .left {
      margin-right: 10px;
    }

    .hospital {
      display: flex;

      li {
        margin-right: 10px;

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