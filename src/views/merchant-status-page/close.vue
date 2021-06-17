<template>
  <div class="merchant-reset-container">
    <div v-if="fail" class="fail">
      <Icon local="fail" size="50" />
      <p class="tip">网络异常，关闭失败</p>
      <p>
        <Button @click="handleRetry">重试</Button>
      </p>
      <div class="footer">
        <Button type="primary" @click="handleJumpOut">跳过，直接进入"总部商品库"</Button>
      </div>
    </div>
    <div v-else>
      <Icon local="time" size="50" />
      <p class="tip">关闭中</p>
    </div>
  </div>
</template>

<script>
  import { fetchGetRunningTaskStatus, fetchTaskFinish } from '@/data/repos/merchantProduct'
  import { BATCH_REL_TASK_STATUS, BATCH_REL_TASK_RESULT_STATUS } from '@/data/enums/batch'
  export default {
    name: 'merchant-close',
    data () {
      return {
        processing: false,
        fail: false,
        id: null
      }
    },
    mounted () {
      this.getRunningStatusStatus()
      this.time = setInterval(this.getRunningStatusStatus, 5000)
    },
    beforeDestroy () {
      clearInterval(this.time)
    },
    methods: {
      async handleRetry () {
        await fetchTaskFinish(this.id)
        this.getRunningStatusStatus()
      },
      async handleJumpOut () {
        await fetchTaskFinish(this.id)
        this.$router.push({ name: 'merchantList' })
      },
      async getRunningStatusStatus () {
        const { id, resultStatus, status } = await fetchGetRunningTaskStatus(4)
        if (id <= 0) {
          this.$router.push({ name: 'merchantList' })
        } else {
          if ([BATCH_REL_TASK_STATUS.INLINE, BATCH_REL_TASK_STATUS.IN_PROCESS].includes(status)) {
            this.processing = true
          } else if (status === BATCH_REL_TASK_STATUS.FINISH) {
            if (BATCH_REL_TASK_RESULT_STATUS.ALL_SUCCESS === resultStatus) {
              await fetchTaskFinish(id)
              this.$router.push({ name: 'merchantList' })
            } else {
              this.id = id
              this.fail = true
            }
          } else {
            this.processing = true
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .merchant-reset-container {
    min-height: 100vh;
    display: flex;
    padding-top: 250px;
    justify-content: center;
    background: #fff;
    .fail {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .tip {
      margin: 20px 0;
      font-weight: 500;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #222222;
    }
    .footer {
      position: fixed;
      padding: 0 30px;
      width: 100%;
      left: 0;
      bottom: 0;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background: #FFFFFF;
      box-shadow: 0 -4px 5px 0 #F7F8FA;
      border-radius: 0 0 2px 2px;
    }
  }
</style>
