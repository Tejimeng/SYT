<template>
  <div>
    <Detail v-if="$route.query.orderId"/>
    <AllOrder v-else/>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import AllOrder from './allOrder/index.vue'
import Detail from './detail/index.vue'

let $route = useRoute()
</script>

<style scoped lang="scss">

</style>