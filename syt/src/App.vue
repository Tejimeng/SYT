<template>
  <div class="container">
    <!--    展示顶部组件-->
    <HospitalTop/>
    <!--    展示路由组件区域-->
    <div class="content">
      <router-view></router-view>
    </div>
    <!--    展示底部组件-->
    <HospitalBottom/>
    <!--    登录组件-->
    <Login v-if="useStore.visiable"/>
  </div>

</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user.ts'

let useStore = useUserStore(0)
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .content {
    margin-top: 70px;
    width: 1400px;
    min-height: 900px;
  }
}
</style>