<template>
  <div>
    <!--   展示订单详情-->
    <el-card class="box-card">
      <!--  卡片头部   -->
      <template #header>
        <div class="detail">挂号详情</div>
      </template>
      <!--   卡片身体 -->
      <div class="top">
        <el-tag class="ml-2" type="success">
          <div class="tag">
            <svg t="1688986415308" class="icon" viewBox="0 0 1497 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="2240" width="16" height="16">
              <path
                  d="M1476.470467 150.422791 688.633041 938.260217C685.780224 950.315666 679.867532 961.795951 670.45784 971.205644L637.926532 1003.736952C610.985823 1030.700667 567.273316 1030.700667 540.332607 1003.736952L533.03952 996.466872C533.016514 996.420859 532.9705 996.397852 532.924487 996.351839L500.393179 963.820531C500.347166 963.774518 500.324159 963.728504 500.278146 963.705498L19.739648 483.167C-7.20106 456.203285-7.20106 412.513784 19.739648 385.550069L52.270956 353.01876C79.234672 326.055045 122.924173 326.055045 149.887888 353.01876L581.744456 784.875329 1346.322227 20.274551C1373.285942-6.689164 1416.975443-6.689164 1443.939158 20.274551L1476.470467 52.805859C1503.434182 79.769575 1503.434182 123.459076 1476.470467 150.422791Z"
                  p-id="2241" fill="#1afa29"></path>
            </svg>
            <span>{{ orderInfo.param?.orderStatusString }}</span>
          </div>
        </el-tag>
        <div class="right_info">
          <img src="../../../../assets/images/code_app.png" alt="">
          <div class="info">
            <p>微信 关注 “北京114预约挂号”</p>
            <p>“快速预约挂号”</p>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <!-- 左侧展示订单详情信息 -->
          <el-descriptions class="margin-top" :column="1" border>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊人信息</div>
              </template>
              {{ orderInfo.patientName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊日期</div>
              </template>
              {{ orderInfo.reserveDate }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊医院</div>
              </template>
              {{ orderInfo.hosname }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊科室</div>
              </template>
              {{ orderInfo.depname }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">医生职称</div>
              </template>
              {{ orderInfo.title }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">挂号费用</div>
              </template>
              <span style="color: red">{{ orderInfo.amount }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">挂号单号</div>
              </template>
              {{ orderInfo.outTradeNo }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">挂号时间</div>
              </template>
              {{ orderInfo.createTime }}
            </el-descriptions-item>
          </el-descriptions>
          <!--        取消预约和支付的按钮组-->
          <!--          v-if="orderInfo.orderStatus==1||orderInfo.orderStatus==0"-->
          <div class="btn">
            <el-popconfirm icon-color="red" title="确定取消预约吗?" @confirm="cancel">
              <template #reference>
                <el-button>取消预约</el-button>
              </template>
            </el-popconfirm>
            <!--            v-if="orderInfo.orderStatus==0"-->
            <el-button
                type="primary"
                size="default"
                @click="openDialog"
            >支付
            </el-button
            >
          </div>
        </div>
        <div class="right">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>注意事项</span>
              </div>
            </template>
            <p>1.请确认就诊人信息是否准确，若填写错误将无法取号就诊，损失由本人承担；</p>
            <p style="color: red">
              2.【取号】就诊当天需在{{ orderInfo.fetchTime }}前
              在医院取号，未取号视为爽约，该号不退不换；
            </p>
            <p>
              3.【退号】在{{ orderInfo.quitTime }}前可在线退号 ，逾期将不可办理退号退费；
            </p>
            <p>
              4.北京114预约挂号支持自费患者使用身份证预约，同时支持北京市医保患者使用北京社保卡在平台预约挂号。请于就诊当日，携带预约挂号所使用的有效身份证件到院取号；
            </p>
            <p>5.请注意北京市医保患者在住院期间不能使用社保卡在门诊取号。</p>
          </el-card>
        </div>
      </div>
    </el-card>
    <!--   展示支付二维码的结构-->
    <el-dialog @close="closeDialog" v-model="dialogTableVisible" title="微信支付" width="500">
      <!--      支付的结构-->
      <div class="qrocde">
        <img :src="imgUrl" alt=""/>
        <p>请使用微信扫一扫</p>
        <p>扫描二维码支付</p>
      </div>
      <!--      底部插槽-->
      <template #footer>
        <el-button type="primary" size="default" @click="closeDialog">关闭窗口</el-button>
      </template>

    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
//@ts-ignore
import {reqOrderInfo, reqCancelOrder, reqQrcode, reqQueryPayState} from '@/api/user/index.ts'
import {useRoute} from "vue-router";
//@ts-ignore
import type {OrderInfo, OrderResponseData, QrCode, PayReslt} from '@/api/user/type.ts'
//@ts-ignore
import {ElMessage} from "element-plus";
//@ts-ignore
import QRCode from 'qrcode'
// 储存订单的数据
let orderInfo = ref<any>({})
let $route = useRoute()
// 控制支付对话框
let dialogTableVisible = ref<boolean>(false)
// 监听是否采取支付
// 存储二维码图片的路径
let imgUrl = ref<string>('')
// 获取订单详情的数据
const getOrderInfo = async () => {
  let result: OrderResponseData = await reqOrderInfo($route.query.orderId as string)
  if (result.code == 200) {
    orderInfo.value = result.data
  }
}
// 取消订单
const cancel = async () => {
  try {
    // 取消预约成功
    await reqCancelOrder($route.query.orderId as string)
    await getOrderInfo()
  } catch (error) {
    ElMessage({
      type: "error",
      message: "取消预约失败！"
    })
  }

}
// 存储定时器的引用
let timer=ref<any>()
// 点击支付的回调
const openDialog = async () => {
  //展示对话框
  dialogTableVisible.value = true
  let result: QrCode = await reqQrcode($route.query.orderId as string);
  //更具服务器返回二维码信息生成二维码图片
  imgUrl.value = await QRCode.toDataURL(result.data.codeUrl);
  //询问服务器当前这笔交易的支付结果
  timer.value = setInterval(async () => {
    let result: PayReslt = await reqQueryPayState($route.query.orderId as string)
    if (result.data) {
      // 支付成功，关闭对话框
      dialogTableVisible.value = false
      // 提示信息
      ElMessage({
        type: "success",
        message: "支付成功"
      })
      // 清除询问定时器
      clearInterval(timer.value)
      // 再次获取订单的详情
      getOrderInfo()
    }
  }, 2000)
}
// 关闭窗口按钮的回调
const closeDialog = () => {
  //关闭对话框,对话框隐藏
  dialogTableVisible.value = false;
  clearInterval(timer.value)
}
onMounted(() => {
  getOrderInfo()
})
</script>

<style scoped lang="scss">
.box-card {
  .detail {
    color: #7f7f7f;
    font-weight: 900;
  }

  .top {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding: 10px;

    .tag {
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        margin-left: 5px;
      }
    }

    .right_info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        width: 40px;
        height: 40px;
      }

      .info {
        margin-left: 10px;

        p {
          font-size: 12px;
          line-height: 20px;
        }
      }
    }
  }

  .bottom {
    display: flex;
    margin-top: 20px;

    .left {
      flex: 4;

      .btn {
        margin: 10px 0px;
      }
    }

    .right {
      margin-left: 20px;
      flex: 6;

      p {
        line-height: 30px;
      }
    }
  }
}

::v-deep(.el-dialog__body) {
  border-top: 1px solid #7f7f7f;
  border-bottom: 1px solid #7f7f7f;
}

.qrocde {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    line-height: 30px;
  }
}
</style>