<template>
  <Modal
    :value="value"
    :closable="false"
    :mask-closable="false"
    ok-text="最小化"
    cancel-text="立即处理"
    @on-ok="handleOk"
    @on-cancel="handleCancel"
    @on-hidden="handleHidden"
    center-layout
    :class-name="className"
    :transition-names="transitionNames"
    ref="modal"
  >
    <Assessment class="monitor-modal-assessment" :summary="info" />
    <div v-if="info.status">
      商品状态良好，请继续保持；祝您生意兴隆，财源广进
    </div>
    <div v-else>
      <p>店内商品存在多项异常，请进入商品监控进行处理，否则可能会影响您店内商品的售卖和门店流量</p>
      <p>1）帮您及时诊断店内商品的状态，预防顾客流失和经济损失</p>
      <p>2）帮您提供商品优化方案，以便于吸引更多的顾客</p>
    </div>
  </Modal>
</template>
<script>
  import Assessment from '@/views/monitor/components/assessment'
  import { fetchMonitorPageInfo } from '@/data/repos/common'
  import jumpTo from '@components/link/jumpTo'

  export default {
    name: 'monitor-modal',
    props: {
      getAnchorPosition: Function
    },
    data () {
      return {
        value: false,
        hidden: false,
        animate: !!this.getAnchorPosition,
        info: {
          status: false, // 信息正常
          total: 0, // 所有检测的商品的总量
          negCount: 0, // 所检测商品中异常的数量
          date: '--' // 检测时间
        }
      }
    },
    computed: {
      className () {
        return `monitor-modal ${this.hidden ? '' : 'show'}`
      },
      transitionNames () {
        if (this.animate) {
          return ['modal-animate-scale', 'modal-animate-fade']
        }
        return undefined
      }
    },
    components: {
      Assessment
    },
    methods: {
      async getData () {
        const { monitorCount } = await fetchMonitorPageInfo()
        const { total, negCount, date } = monitorCount
        this.info.status = negCount <= 0
        this.info.total = total
        this.info.negCount = negCount
        this.info.date = date
        this.value = true
      },
      animateHandler () {
        const point = this.getAnchorPosition()
        if (!point) {
          console.error('monitor modal getAnchorPosition 返回值为空')
          return
        }
        const [x, y] = point
        const $modal = this.$refs.modal && this.$refs.modal.$el
        if (!$modal) {
          console.error('monitor modal ref modal 为空')
          return
        }
        // TODO 如此🤢
        const $modalContent = $modal.querySelector('.boo-modal')
        if (!$modalContent) {
          console.error('monitor modal .boo-modal 找不到')
          return
        }
        const { left } = $modalContent.getBoundingClientRect()
        const offsetX = x - left
        // const $container = $modal.querySelector('.monitor-modal')
        // if (!$container) {
        //   console.error('monitor modal .monitor-modal 找不到')
        //   return
        // }
        $modalContent.style.transformOrigin = `${offsetX}px 0`
        $modalContent.style.top = `${y}px`
        // $modal.style.transform = `translate(${offsetX}px, ${offsetY}px)`
      },
      handleCancel () {
        jumpTo('/product/monitor')
      },
      handleOk () {
        if (this.animate) {
          this.animateHandler()
        }
        this.value = false
      },
      handleHidden () {
        this.hidden = true
        this.$nextTick(() => {
          this.$emit('hidden')
        })
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style lang="less">
  @keyframes scale-out {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: .5;
      transform: scale(.5)
    }
    100% {
      opacity: 0;
      transform: scale(0);
    }
  }
  @keyframes scale-in {
    0% {
        opacity: 0;
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
  }

  @keyframes fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
  }
  @keyframes fade-out {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
  }

  @in-duration: .3s;
  @out-duration: .3s;

  .monitor-modal {
    // transition: transform @out-duration linear;
    .boo-modal {
      transition: top @out-duration cubic-bezier(0,0,.08,.8);
      top: 200px;
    }
    &.show {
      &, .boo-modal {
        display: block !important;
      }
    }
  }
  .modal-animate-fade {
    &-enter-active {
      animation: fade-in @in-duration linear;
    }
    &-leave-active {
      animation: fade-out @out-duration linear;
    }
  }
  .modal-animate-scale {
    &-enter-active {
      animation: scale-in @in-duration linear;
    }
    &-leave-active {
      animation: scale-out @out-duration linear;
    }
  }
  .monitor-modal-assessment {
    height: auto;
    padding: 10px 0;
    margin-bottom: 0;
    /deep/ .assessment-pic {
      width: 50px;
      height: 50px;
      background-size: contain;
      background-repeat: no-repeat;
      margin-right: 10px;
    }
    /deep/ .assessment {
      .desc {
        font-size: 16px;
        line-height: 20px;
      }
      .date {
        font-size: 12px;
        margin-top: 4px;
      }
    }
  }
</style>
