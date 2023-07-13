<template>
  <!--  实名认证-->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h1>实名信息</h1>
      </div>
    </template>
    <!--    提示-->
    <div class="tip">
      <p>
        <el-icon>
          <InfoFilled/>
        </el-icon
        >
        完成实名认证后才能添加就诊人，正常进行挂号，为了不影响后续步骤，建议提前实名认证。
      </p>
    </div>
    <!--    底部认证部分-->
    <!--    认证-->
    <el-descriptions v-if="userInfo.authStatus==1" class="margin-top" :column="1" border style="margin: 20px auto">
      <el-descriptions-item :width="20" label-align="center">
        <template #label>
          <div class="cell-item">
            用户姓名
          </div>
        </template>
        {{ userInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item :width="20" label-align="center">
        <template #label>
          <div class="cell-item">
            证件类型
          </div>
        </template>
        {{ userInfo.certificatesType == "10" ? "身份证" : "户口本" }}
      </el-descriptions-item>
      <el-descriptions-item :width="20" label-align="center">
        <template #label>
          <div class="cell-item">
            证件号码
          </div>
        </template>
        {{ userInfo.certificatesNo }}
      </el-descriptions-item>
    </el-descriptions>
    <!--  未认证-->
    <el-form
        v-if="userInfo.authStatus==0"
        style="width: 55%;margin: 20px auto"
        label-width="100"
        :model="params"
        :rules="rules"
        ref="form"
    >
      <el-form-item prop="name" label="用户姓名">
        <el-input placeholder="请输入用户姓名" v-model="params.name"></el-input>
      </el-form-item>
      <el-form-item prop="certificatesType" label="证件类型">
        <el-select style="width: 100%" placeholder="请选择证件类型" v-model="params.certificatesType">
          <el-option v-for="(item,index) in arrType" :value="item.value" :label="item.name" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="certificatesNo" label="证件号码">
        <el-input placeholder="请输入证件号码" v-model="params.certificatesNo"></el-input>
      </el-form-item>
      <el-form-item prop="certificatesUrl" label="上传证件">
        <el-upload
            ref="upload"
            list-type="picture-card"
            :limit="1"
            :on-exceed="exceedhandler"
            :on-success="successhandler"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            action="/api/oss/file/fileUpload?fileHost=userAuah">
          <img style="width: 100%;height: 100%" src="../../../assets/images/auth_example.png" alt="">
        </el-upload>
        <el-dialog v-model="dialogVisiable">
          <img w-full v-if="params.certificatesUrl" style="width: 100%;height: 100%;" :src="params.certificatesUrl"
               alt="Preview Image"/>
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="submit">提交</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import {InfoFilled} from '@element-plus/icons-vue'
import {reqCertationType, reqUserInfo, reqUserCertation} from '@/api/user/index.ts'
import {onMounted, reactive, ref} from "vue";
import type {UserParams, UseringoResponseData, CertationTypeResponseData, CertationArr} from "@/api/user/type.ts";
import {ElMessage} from "element-plus";
// 获取表单
let form = ref()
// 存储用户的认证信息
let userInfo = ref<any>({})
let arrType = ref<CertationArr>([])
// 收集用户表单认证的数据
let params = reactive<UserParams>({
  certificatesNo: "",
  certificatesType: "",
  certificatesUrl: "",
  name: "",
})
// 控制图片的预览
let dialogVisiable = ref<boolean>(false)
let upload = ref()
// 表单校验函数
const validatorName = (rule: any, value: any, callback: any) => {
  let reg = /^[\u00B7\u3007\u3400-\u4DBF\u4E00-\u9FFF\uE000-\uF8FF\uD840-\uD8C0\uDC00-\uDFFF\uF900-\uFAFF]+$/;
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("请输入正确的姓名！"))
  }

}
const validatorType = (rule: any, value: any, callback: any) => {
  if (value == "10" || value == "20") {
    callback();
  } else {
    callback(new Error("请选择证件的类型"));
  }
}
const validatorNo = (rule: any, value: any, callback: any) => {
  let sfz = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
  let hkb = /^\d{9}$/;
  if (sfz.test(value) || hkb.test(value)) {
    callback();
  } else {
    callback(new Error("请输入正确的身份证或者户口本的号码"));
  }
}
const validatorUrl = (rule: any, value: any, callback: any) => {
  // 图片的校验不能用正则表达式来进行校验
  if (value.length) {
    callback()
  } else {
    callback(new Error("请上传证件照！"))
  }
}
// 表单校验的规则
const rules = {
  name: [{required: true, validator: validatorName}],
  certificatesType: [{required: true, validator: validatorType}],
  certificatesNo: [{required: true, validator: validatorNo}],
  certificatesUrl: [{required: true, validator: validatorUrl}],
}
// 获取用户的认证信息
const getUserInfo = async () => {
  // 携带用户的token字段发起请求
  let result: UseringoResponseData = await reqUserInfo()
  if (result.code) {
    userInfo.value = result.data
  }
}
// 获取证件的类型
const getType = async () => {
  let result: CertationTypeResponseData = await reqCertationType()
  if (result.code == 200) {
    arrType.value = result.data
  }
}
// 图片上传的回调
const exceedhandler = () => {
  ElMessage({
    type: 'error',
    message: '图片最多只能上传一张！'
  })
}
const successhandler = (response: any, uploadFile: any, uploadFiles: any) => {
  // 清除之前图片字段的校验
  form.value.clearValidate("certificatesUrl")
  // 收集图片的路径
  params.certificatesUrl = response.data
}
const handlePictureCardPreview = (uploadFile: any) => {
  dialogVisiable.value = true
}
const handleRemove = () => {
  params.certificatesUrl = ''
}
const reset = () => {
  upload.value.clearFiles()
  Object.assign(params, {
    certificatesNo: "",
    certificatesType: "",
    certificatesUrl: "",
    name: "",
  })
}
const submit = async () => {
  //全部的表单校验通过返回一个成功的promise
  //如果有一个表单校验失败返回的是一个失败的promise对象,后面的语句就不在执行了
  await form.value.validate()
  try {
    //认证成功
    await reqUserCertation(params);
    //提示消息
    ElMessage({
      type: "success",
      message: "认证成功",
    });
    //认证成功以后再次获取用户信息
    getUserInfo();
  } catch (error) {
    ElMessage({
      type: "error",
      message: "认证失败",
    });
  }
}
// 挂载时执行
onMounted(() => {
  // 获取用户的信息
  getUserInfo()
  // 获取证件的类型
  getType()
})
</script>

<style scoped lang="scss">
.box-card {
  .tip {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #7f7f7f
  }
}
</style>