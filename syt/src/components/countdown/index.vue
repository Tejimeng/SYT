<template>
  <div>
    <span> 获取验证码({{ time }}s)</span>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

let props = defineProps(['flag'])
let $emit = defineEmits(['getFlag'])
let time = ref<number>(5)
watch(() => props.flag, () => {
// 开启定时器
      let timer = setInterval(() => {
        time.value--
        if (time.value == 0) {
          $emit('getFlag', false)
          clearInterval(timer)
        }
      }, 1000)
    },
    {
      immediate: true
    })
</script>

<style scoped lang="scss">

</style>