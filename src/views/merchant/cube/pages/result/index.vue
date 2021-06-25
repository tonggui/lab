<template>
  <div class="merchant-cube-result-container">
    <ResultBanner :type="type" button-text="下载【失败商品&分店表】" @on-click-btn="handleClickBtn">
      <span class="merchant-cube-result-success" slot="success">全部创建成功，共<span class="success-num">{{succeedNum}}</span>个商品已创建至总部商品库并关联所选门店</span>
      <span class="merchant-cube-result-fail" slot="fail">{{part ? '部分' : '全部'}}商品创建失败，详细请下载右侧表格文件</span>
    </ResultBanner>
    <div class="fix-bottom">
      <div class="btn-cube" @click="jumpToCube">
        返回“魔方”创建其他
      </div>
      <div class="btn-center" @click="jumpToCenter">
        完成，返回商品库
      </div>
    </div>
  </div>
</template>

<script>
  import ResultBanner from '@/components/result-banner'
  import { getCubeTaskStatus, getCubeTaskConfirm } from '@/data/repos/merchantCube'
  import { BATCH_REL_TASK_RESULT_STATUS } from '@/data/enums/batch'

  export default {
    name: 'result',
    data () {
      return {
        type: 'success',
        url: '',
        failText: '',
        succeedNum: 0,
        part: false,
        taskId: -1
      }
    },
    components: {
      ResultBanner
    },
    methods: {
      handleClickBtn () {
        if (this.url) return
        window.location.href = this.url
      },
      async getRunningStatusStatus () {
        const { taskId, processResult } = await getCubeTaskStatus()
        const {
          resultStatus,
          succeedNum,
          failedUrl
        } = processResult || {}

        if (taskId <= 0) this.$router.push({ name: 'merchantCubeList' })
        this.taskId = taskId
        this.type = resultStatus === BATCH_REL_TASK_RESULT_STATUS.ALL_SUCCESS ? 'success' : 'fail'
        this.part = resultStatus === BATCH_REL_TASK_RESULT_STATUS.PART_SUCCESS
        this.url = failedUrl
        this.succeedNum = succeedNum
      },
      async jumpToCube () {
        await getCubeTaskConfirm(this.taskId)
        // TODO 首次
        this.$Modal.info({
          title: '温馨提示',
          content: '若您后续还想查看失败商品&分店明细，可通过"商品首页-任务进度"查看',
          onOk: () => {
            this.$router.push({ name: 'merchantCubeList' })
          }
        })
      },
      async jumpToCenter () {
        await getCubeTaskConfirm(this.taskId)
        this.$router.push({ name: 'merchantList' })
      }
    },
    mounted () {
      this.getRunningStatusStatus()
    }
  }
</script>

<style lang="less">

</style>
<style lang="less" scoped>
  .merchant-cube-result-container {
    background: #fff;
    padding: 30px 30px 70px;
    position: relative;
    .merchant-cube-result-success {
      font-weight: 500;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #222222;
      .success-num {
          color: #00BF7F;
      }
    }
    .merchant-cube-result-fail {
      font-weight: 500;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #222222;
    }
    .fix-bottom {
      position: absolute;
      bottom: 30px;
      display: flex;
      width: 100%;
      justify-content: center;
      .btn-cube, .btn-center {
        width: 152px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 25px;
        cursor: pointer;
      }
      .btn-cube {
        border: 1px solid #999999;
        margin-right: 8px;
      }
      .btn-center {
        background-image: linear-gradient(-45deg, #FFC34D 0%, #FFE14D 100%);
      }
    }
  }
</style>
