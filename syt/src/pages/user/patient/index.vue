<template>
  <!-- 就诊人管理模块-->
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>就诊人管理</span>
          <el-button class="button" :icon="User" type="success" @click="addUser">添加就诊人</el-button>
        </div>
      </template>
      <!--     展示就诊人-->
      <div class="visitors" v-if="scene==0">
        <Visitor @removeUser="getAllUser" @changeScene="changeScene" v-for="(user,index) in userArr" :key="user.id" :user="user" :index="index"/>
      </div>
      <!--      添加或者修改就诊人的部分-->
      <div class="form" v-if="scene==1">
        <el-divider content-position="left">就诊人信息</el-divider>
        <el-form style="width: 60%;margin: 10px auto ;" label-width="90">
          <el-form-item label="用户姓名">
            <el-input placeholder="请你输入用户姓名" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select
                placeholder="请你选择证件的类型"
                style="width: 100%"
                v-model="userParams.certificatesType"
            >
              <el-option
                  v-for="item in certationArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input
                placeholder="请你输入证件号码"
                v-model="userParams.certificatesNo"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户性别">
            <el-radio-group v-model="userParams.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker
                v-model="userParams.birthdate"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请你选择日期"
            />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input
                placeholder="请你输入用户手机号码"
                v-model="userParams.phone"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-divider content-position="left"
        >建档信息（完善后部分医院首次就诊不排队建档）
        </el-divider
        >
        <el-form style="width: 60%; margin: 10px auto" label-width="90">
          <el-form-item label="婚姻状况">
            <el-radio-group v-model="userParams.isMarry">
              <el-radio :label="1">已婚</el-radio>
              <el-radio :label="0">未婚</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自费/医保">
            <el-radio-group v-model="userParams.isInsure">
              <el-radio :label="1">自费</el-radio>
              <el-radio :label="0">医保</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="当前的住址">
            <el-cascader :props="props" v-model="userParams.addressSelected"/>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input
                placeholder="请你输入用户详细地址"
                v-model="userParams.address"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-divider content-position="left">联系人信息（选填）</el-divider>
        <el-form style="width: 60%; margin: 10px auto" label-width="90">
          <el-form-item label="用户姓名">
            <el-input
                placeholder="请你输入用户姓名"
                v-model="userParams.contactsName"
            ></el-input>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select
                placeholder="请你选择证件的类型"
                style="width: 100%"
                v-model="userParams.contactsCertificatesType"
            >
              <el-option
                  v-for="item in certationArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input
                placeholder="请你输入证件号码"
                v-model="userParams.contactsCertificatesNo"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input
                placeholder="请你输入用户手机号码"
                v-model="userParams.contactsPhone"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="default" @click="submit">提交</el-button>
            <el-button type="primary" size="default" @click="reset">重写</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {User} from '@element-plus/icons-vue'
import Visitor from "@/components/visitor/visitor.vue";
import {reqGetUser} from "@/api/hospital";
import {onMounted, reactive, ref, watch} from "vue";
import type {UserResponseData, UserArr} from '@/api/hospital/type.ts'
import {reqAddOrUpdateUser, reqCertationType, reqCity} from "@/api/user";
import type {CertationTypeResponseData, CertationArr} from "@/api/user/type.ts";
//@ts-ignore
import type {CascaderProps} from 'element-plus'
import {AddOrUpdateUser} from "@/api/user/type.ts";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";

let $route = useRoute()
let $router = useRouter()
// 存储就诊人的信息
let userArr = ref<UserArr>([])
// 定义展示数据的数据
let scene = ref<number>(0)
// 存储证件类型的数据
let certationArr = ref<CertationArr>([])
// 收集就诊人的表单数据
let userParams = reactive<AddOrUpdateUser>({
  name: '',
  certificatesType: '',
  certificatesNo: '',
  sex: 0,
  birthdate: '',
  phone: '',
  isMarry: 0,
  isInsure: 0,
  addressSelected: [],
  address: '',
  contactsName: '',
  contactsCertificatesType: '',
  contactsCertificatesNo: '',
  contactsPhone: ''
})
// 获取就诊人的信息
const getAllUser = async () => {
  let result: UserResponseData = await reqGetUser()
  if (result.code == 200) {
    userArr.value = result.data
  }
}
const getCertationType = async () => {
  let result: CertationTypeResponseData = await reqCertationType()
  if (result.code == 200) {
    certationArr.value = result.data
  }
}
// 添加就诊人
const addUser = () => {
  // 清空上次所填写
  reset()
  scene.value = 1
}
// 子组件的自定义事件
const changeScene = (user: AddOrUpdateUser) => {
  scene.value = 1
  // 收集数据
  Object.assign(userParams, user)
}
// 级联层级选择器
const props: CascaderProps = {
  lazy: true,
  async lazyLoad(node: any, resolve: any) {
    // 在没有选择时，根据86发送请求，在选择了子节点时，根据节点的id值发起下一次请求
    let result: any = await reqCity(node.data.id || '86')
    // 整理返回的城市数组
    let showData = result.data.map((item: any) => {
      return {
        id: item.id,// 当前选择节点的id
        label: item.name,//名字
        value: item.value,// 值
        leaf: !item.hasChildren // 是否有子节点
      }
    })
    // 注入展示的组件中
    resolve(showData)
  }
}
// 表单的提交
const submit = async () => {
  // 新增或者更新
  try {
    await reqAddOrUpdateUser(userParams)
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '新增成功'
    })
    // 判断路由并且切换场景并且获取全部的就诊人进行展示
    if ($route.query.type == 'add') {
      $router.back()
    } else {
      scene.value = 0
      getAllUser()
    }
  } catch (error) {
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新失败' : '新增失败'
    })
  }
}
// 重置表单
const reset = () => {
  Object.assign(userParams, {
    id: null,
    name: '',
    certificatesType: '',
    certificatesNo: '',
    sex: 0,
    birthdate: '',
    phone: '',
    isMarry: 0,
    isInsure: 0,
    addressSelected: [],
    address: '',
    contactsName: '',
    contactsCertificatesType: '',
    contactsCertificatesNo: '',
    contactsPhone: ''
  })
}
// 监听
watch(() => userArr.value, () => {
  // 如果是预约挂号组件跳转过来会让组件重新挂载
  if ($route.query.type == 'edit') {
    let user = userArr.value.find((item: any) => {
      return item.id == $route.query.id
    })
    Object.assign(userParams, user)
  }
})
// 挂载
onMounted(() => {
  // 获取就诊人的信息
  getAllUser()
  // 获取证件的类型
  getCertationType()
  // 判断跳转的来源
  if ($route.query.type == 'add') {
    scene.value = 1
  }
  if ($route.query.type == 'edit') {
    scene.value = 1
  }
})
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.visitors {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 32%;
    margin: 5px;
  }
}
</style>