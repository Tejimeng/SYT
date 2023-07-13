<template>
  <div class="visitor">
    <div class="top">
      <div class="left">
        <span class="free">{{ user.isInsure == 1 ? '医保' : '自费' }}</span>
        <span class="username">{{ user.name }}</span>
      </div>
      <div class="right">
        <el-button circle type="primary" size="default" :icon="Edit" @click="handler"></el-button>
        <el-popconfirm @confirm="removeUser" :title="`你确认要删除${user.name}吗？`" width="200">
          <template #reference>
            <el-button circle v-if="$route.path=='/user/patient'" type="danger" size="default"
                       :icon="Delete"></el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div class="bottom">
      <p>证件类型:{{ user.param.certificatesTypeString }}</p>
      <p>证件号码:{{ user.certificatesNo }}</p>
      <p>用户性别:{{ user.sex == 0 ? "女生" : "男士" }}</p>
      <p>出生日期：{{ user.birthdate }}</p>
      <p>手机号码：{{ user.phone }}</p>
      <p>婚姻状况:{{ user.isMarry == 0 ? "未婚" : "已婚" }}</p>
      <p>当前住址{{ user.param.cityString }}</p>
      <p>详细地址：{{ user.param.fullAddress }}</p>
      <transition name="confirm">
        <div class="confirm" v-if="index === currentIndex">已选择</div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Edit, Delete
} from '@element-plus/icons-vue'
import {useRoute, useRouter} from "vue-router";
import {reqRemoveUser} from "@/api/user";
import {ElMessage} from "element-plus";

let $route = useRoute()
let $router = useRouter()
// 接收父组件传递的参数
let props = defineProps(['user', 'index', 'currentIndex'])
// 接收父组件传递的自定义事件
let $emit = defineEmits(['changeScene', 'removeUser'])
// 修改就诊人的信息函数回调
const handler = () => {
  // 在就诊人模块触发，直接通过子组件传递给父组件
  if ($route.path == '/user/patient') {
    $emit('changeScene', props.user)
  }
  // 在预约挂号模块触发，通过路由跳转然后携带参数
  else {
    $router.push({
      path: '/user/patient', query: {
        type: 'edit',
        id: props.user.id
      }
    })
  }
}
// 删除用户
const removeUser = async () => {
  try {
    await reqRemoveUser(props.user.id)
    ElMessage({
      type: 'success',
      message: '删除成功！'
    })
    $emit('removeUser')
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '删除失败！'
    })
  }
}
</script>

<style scoped lang="scss">
.visitor {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);

  .top {
    height: 60px;
    background: #e5e5e5;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .left {
      .free {
        background: white;
        padding: 5px;
        font-size: 12px;
        margin-right: 5px;
        border-radius: 10px;
      }

      .username {
        color: #7f7f7f;
      }
    }
  }

  .bottom {
    position: relative;
    padding: 20px;

    p {
      line-height: 40px;
    }

    .confirm {
      position: absolute;
      width: 200px;
      height: 200px;
      color: red;
      border-radius: 50%;
      border: 1px dashed red;
      text-align: center;
      line-height: 200px;
      left: 20%;
      top: 20%;
      opacity: 0.5;
      transform: rotate(35deg);
      font-weight: 900;
    }

    .confirm-enter-from {
      transform: scale(1);
    }

    .confirm-enter-active {
      transition: all 0.3s;
    }

    .confirm-enter-to {
      transform: scale(1.2);
    }
  }
}
</style>