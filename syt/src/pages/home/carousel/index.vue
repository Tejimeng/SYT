<!--轮播图组件-->
<template>
  <div>
    <el-carousel height="350px">
      <el-carousel-item v-for="item in 4" :key="item">
        <!--          此处可以自己定义一个图片数据组，用于轮播-->
        <img src="../../../assets/images/web-banner-1.png" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
img {
  width: 100%;
  height: 350px;
}
</style>