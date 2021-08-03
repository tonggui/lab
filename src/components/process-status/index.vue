<template>
  <div class="step-rel-container">
    <Icon local="time" size="64" />
    <div class="progress-status">{{statusText}}</div>
    <slot name="status">
      <template v-if="isInLine">
        <div class="tip">{{inlineText}}</div>
      </template>
      <template v-else>
        <div class="status">
          {{processText}}
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progressing" :style="{ width: `${(succeedNum / totalNum) * 100}%` }" />
          </div>
          <div class="total">{{succeedNum}}/{{totalNum}}</div>
        </div>
        <div class="tip">
          {{tip}}
        </div>
      </template>
    </slot>
    <slot name="bottom">
      <Button v-if="isInLine" type="primary" @click="goToList" class="btn">{{inlineBtnText}}</Button>
      <Button v-else @click="goToList" class="btn">{{processBtnText}}</Button>
    </slot>
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
      inlineText: {
        type: String,
        default: '抱歉，可能需等待较长时间。您可去做其他事情，创建完毕会马上通知您哦～'
      },
      inlineBtnText: {
        type: String,
        default: '返回"商品库"'
      },
      processText: String,
      processBtnText: {
        type: String,
        default: '返回"商品库"'
      },
      succeedNum: Number,
      totalNum: Number,
      tip: {
        type: String,
        default: '马上关联完毕，请您耐心等待哦~'
      },
      checkRunningStatus: Function
    },
    computed: {
      isInLine () {
        return this.status === BATCH_REL_TASK_STATUS.INLINE
      },
      statusText () {
        return this.isInLine ? '排队中' : '创建中'
      }
    },
    methods: {
      goToList () {
        this.$emit('on-click-btn')
        // this.$router.push({ name: 'merchantList' })
      },
      async checkStatus () {
        try {
          await this.checkRunningStatus()
        } catch (err) {
          console.log('这里有错', err)
        }
      },
      loopCheckStatus () {
        // 轮询
        this.timeout = setInterval(this.checkStatus, 5 * 1000)
      }
    },
    beforeDestroy () {
      clearInterval(this.timeout)
    },
    mounted () {
      console.log('this.', this.checkRunningStatus)
      this.loopCheckStatus()
    }
  }
</script>

<style lang="less" scoped>
  .step-rel-container {
    padding-top: 142px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    font-family: PingFangSC-Medium;
    color: #222222;
    text-align: center;
    font-size: 12px;
    .progress-status {
      font-size: 20px;
      margin-top: 20px;
      margin-bottom: 5px;
    }
    .status {
      margin-bottom: 28px;
      font-size: 14px;
    }
    .progress-container {
      display: flex;
      align-items: center;
      margin-bottom: 14px;
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
      margin-bottom: 48px;
      font-size: 14px;
    }
    .btn {
      border-radius: 25px;
      background-image: linear-gradient(-45deg, #FFC34D 0%, #FFE14D 100%);
      border: none;
      padding: 10px 22px;
      font-weight: 500;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #222222;
      text-align: center;
      height: auto;
      line-height: unset;
    }
  }
</style>
