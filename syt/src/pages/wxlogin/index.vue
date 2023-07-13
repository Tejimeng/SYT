<template>
  <div>
    <!--  此页面为微信扫码登录后的重定向页面 ，用于储存参数-->
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {SET_TOKEN, GET_TOKEN, REMOVE_TOKEN} from "@/utils/user.ts";

let $route = useRoute()
//登录成功之后储存用户的信息
SET_TOKEN(JSON.stringify($route.query))
let html:any=document.querySelector('html')
html.style.display='none'
</script>

<style scoped lang="scss">

</style>