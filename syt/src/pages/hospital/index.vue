<template>
  <div class="hospital">
    <!--  左侧导航区域-->
    <div class="menu">
      <div class="top">
        <el-icon>
          <PriceTag/>
        </el-icon>
        <span>/ 医院详情</span>
      </div>
      <!--      启用router属性来直接跳转路由-->
      <!--   保证当前的路径进行高亮$route.path   -->
      <el-menu
          :default-active="$route.path+'?hoscode='+nowhoscode"
          class="el-menu-vertical-demo"
          :router="true"
      >
        <el-menu-item :index="'/hospital/register?hoscode='+nowhoscode">
          <el-icon>
            <icon-menu/>
          </el-icon>
          <span>预约挂号</span>
        </el-menu-item>
        <el-menu-item :index="'/hospital/detail?hoscode='+nowhoscode">
          <el-icon>
            <document/>
          </el-icon>
          <span>医院详情</span>
        </el-menu-item>
        <el-menu-item :index="'/hospital/notice?hoscode='+nowhoscode">
          <el-icon>
            <setting/>
          </el-icon>
          <span>预约须知</span>
        </el-menu-item>
        <el-menu-item :index="'/hospital/close?hoscode='+nowhoscode">
          <el-icon>
            <Discount/>
          </el-icon>
          <span>停诊信息</span>
        </el-menu-item>
        <el-menu-item :index="'/hospital/search?hoscode='+nowhoscode">
          <el-icon>
            <Notification/>
          </el-icon>
          <span>查询/取消</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!--    右侧展示内容区域-->
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PriceTag,
  Notification,
  Document,
  Menu as IconMenu,
  Discount,
  Setting,
} from '@element-plus/icons-vue'
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import useDetailStore from '@/store/modules/hospitalDetail.ts'
// 获取仓库实例
let detailStore = useDetailStore()
let $route = useRoute()
let nowhoscode = ref<string>('')
onMounted(() => {
  // 储存当前的路由参数
  nowhoscode.value = $route.query.hoscode as string
  // 获取医院的数据
  detailStore.getHospital($route.query.hoscode as string)
  // 获取上述医院的科室内容
  detailStore.getDeparment($route.query.hoscode as string)
})
</script>

<style scoped lang="scss">
.hospital {
  display: flex;

  .menu {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;

    .top {
      color: #7f7f7f;
    }
  }

  .content {
    flex: 8;
  }
}
</style>