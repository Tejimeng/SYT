<template>
  <div class="user">
    <!--    左侧导航-->
    <div class="menu">
      <div class="top">
        <el-icon>
          <PriceTag/>
        </el-icon>
        <span>/ 会员中心</span>
      </div>
      <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          :router="true"
      >
        <el-menu-item index="/user/certification">
          <el-icon>
            <Notification/>
          </el-icon>
          <span>实名认证</span>
        </el-menu-item>
        <el-menu-item index="/user/order">
          <el-icon>
            <icon-menu/>
          </el-icon>
          <span>挂号订单</span>
        </el-menu-item>
        <el-menu-item index="/user/patient">
          <el-icon>
            <document/>
          </el-icon>
          <span>就诊人管理</span>
        </el-menu-item>
        <el-menu-item index="/user/profile">
          <el-icon>
            <setting/>
          </el-icon>
          <span>账号信息</span>
        </el-menu-item>
        <el-menu-item index="/user/feedback">
          <el-icon>
            <Discount/>
          </el-icon>
          <span>意见反馈</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!--    中心二级路由区域-->
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

let $route = useRoute()
</script>

<style scoped lang="scss">
.user {
  display: flex;

  .menu {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .content {
    flex: 8;
  }
}
</style>