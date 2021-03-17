<template>
  <div class="step-rel-container">
    <Icon local="time" size="50" />
    <div class="progress-status">{{statusText}}</div>
    <template v-if="isInLine">
      <div class="tip">抱歉，可能需等待较长时间。您可去做其他事情，创建完毕会马上通知您哦～</div>
    </template>
    <template v-else>
      <div class="status">已关联{{poiTaskDoneCount}}个门店/共{{poiCount}}个门店</div>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progressing" :style="{ width: `${(poiTaskDoneCount / poiCount) * 100}%` }" />
        </div>
        <div class="total">{{poiTaskDoneCount}}/{{poiCount}}</div>
      </div>
      <div class="tip">
        马上创建完毕，请您耐心等待哦~
      </div>
    </template>
    <Button v-if="isInLine" type="primary" @click="goToList">返回"商品列表"</Button>
    <Button v-else @click="goToList">返回"商品列表"</Button>
  </div>
</template>

<script>
  import { BATCH_REL_TASK_STATUS } from '@/data/enums/batch'

  export default {
    name: 'step-rel',
    props: {
      status: {
        type: Number,
        validator (v) {
          return Object.values(BATCH_REL_TASK_STATUS).includes(v)
        }
      },
      poiCount: Number,
      poiTaskDoneCount: Number,
      checkRunningStatus: Function
    },
    computed: {
      isInLine () {
        return this.status === BATCH_REL_TASK_STATUS.INLINE
      },
      statusText () {
        return this.isInLine ? '排队中' : '处理中'
      }
    },
    methods: {
      goToList () {
        this.$router.push({ name: 'merchantList' })
      },
      async checkStatus () {
        await this.checkRunningStatus()
      },
      loopCheckStatus () {
        this.timeout = setInterval(this.checkStatus, 5 * 1000)
      }
    },
    beforeDestroy () {
      clearTimeout(this.timeout)
    },
    mounted () {
      this.loopCheckStatus()
    }
  }
</script>

<style lang="less" scoped>
  .step-rel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    font-family: PingFangSC-Medium;
    color: #222222;
    text-align: center;
    font-size: 12px;
    .progress-status {
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 5px;
    }
    .status {
      margin-bottom: 20px;
    }
    .progress-container {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .progress-bar {
        width: 320px;
        height: 8px;
        background: #EEEEEE;
        border-radius: 1px;
        .progressing {
          height: 100%;
          background: #00BF7F;
          transition: width 1s;
          border-radius: 1px;
        }
      }
      .total {
        margin-left: 16px;
      }
    }
    .tip {
      font-weight: 400;
      font-family: PingFangSC-Regular;
      color: #999999;
      text-align: center;
      margin-bottom: 40px;
    }
  }
</style>
