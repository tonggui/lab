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
    class-name="vertical-center-modal"
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
    data () {
      return {
        value: false,
        info: {
          status: false, // 信息正常
          total: 0, // 所有检测的商品的总量
          negCount: 0, // 所检测商品中异常的数量
          date: '--' // 检测时间
        }
      }
    },
    components: {
      Assessment
    },
    methods: {
      async getData () {
        const { monitorCount } = await fetchMonitorPageInfo()
        const { monitorStatus, total, negCount, date } = monitorCount
        this.info.status = monitorStatus
        this.info.total = total
        this.info.negCount = negCount
        this.info.date = date
        this.value = true
      },
      handleCancel () {
        jumpTo('/product/monitor')
      },
      handleOk () {
        this.value = false
      },
      handleHidden () {
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
<style lang="less" scoped>
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
