<template>
  <div class="top">
    <div class="content">
      <!--  左侧-->
      <div class="left" @click="goBack">
        <img src="../../assets/images/logo.png" alt="">
        <p>尚医通 预约挂号统一平台</p>
      </div>
      <!-- 右侧-->
      <div class="right">
        <p class="help">帮助中心</p>
        <!--         未登录-->
        <p class="login" @click="login" v-if="!userStore.userInfo.name">登录/注册</p>
        <!--         登录-->
        <el-dropdown v-else>
          <span class="el-dropdown-link">
            {{ userStore.userInfo.name }}
          <el-icon class="el-icon--right"><arrow-down/></el-icon>
        </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goUser('/user/certification')">实名认证</el-dropdown-item>
              <el-dropdown-item @click="goUser('/user/order')">挂号订单</el-dropdown-item>
              <el-dropdown-item @click="goUser('/user/patient')">就诊人管理</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import useUserStore from "@/store/modules/user.ts";
import {ArrowDown} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

let userStore = useUserStore()
let $router = useRouter()
const goBack = () => {
  $router.push({path: "/home"})
}
const login = () => {
  userStore.visiable = !userStore.visiable
}
// 退出登录
const logout = () => {
  userStore.logout()
  ElMessage({
    type: 'warning',
    message: "退出成功!"
  })
  $router.push({path: '/home'})
}
//点击顶部下拉菜单进行路由跳转
const goUser = (path: string) => {
  $router.push({path: path});
};
</script>

<style scoped lang="scss">
.top {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  background-color: #fff;

  .content {
    width: 1400px;
    height: 70px;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }

      p {
        font-size: 20px;
        color: #55a6fe;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #bbb;

      .help {
        margin-right: 10px
      }

      p {
        cursor: pointer;

        &:hover {
          color: #55a6fe;
        }
      }
    }
  }
}
</style>