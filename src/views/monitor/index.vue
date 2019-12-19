<template>
  <div class="product-monitor">
    <BreadcrumbHeader>商品监控</BreadcrumbHeader>
    <Assessment :summary="summaryObj" />
    <Row class="gutter" :gutter="16">
      <Col span="12"></Col>
    </Row>
  </div>
</template>

<script>
  import BreadcrumbHeader from '@/views/components/breadcrumb-header'
  import Assessment from './components/assessment'
  import { fetchMonitorPageInfo } from '@/data/repos/common'
  // import { PROBLEM_TYPE as TYPE, PROBLEM_DETAIL as DETAIL } from './constants'

  export default {
    name: 'monitor',
    components: {
      BreadcrumbHeader,
      Assessment
    },
    data () {
      return {
        problems: [], // 异常
        monitorStatus: false, // 信息正常
        total: 300, // 所有检测的商品的总量
        negCount: 115, // 所检测商品中异常的数量
        date: '2019-08-05', // 检测时间
        priceAnomaly: 4, // 价格异常个数
        noPic: 20, // 无图个数
        poorWhiteRate: 20, // 非白底图个数
        poorQuality: 14, // 质量差图个数
        soldOut: 20, // 全部售罄个数
        stockAnomaly: 10, // 库存异常个数
        incomplete: 5, // 信息不全商品个数
        unCompliance: 20, // 信息不规范商品个数
        illegal: 16, // 违规商品个数
        unsalable: 10 // 滞销商品个数
      }
    },
    computed: {
      summaryObj () {
        return {
          status: this.monitorStatus,
          total: this.total,
          negCount: this.negCount,
          date: this.date
        }
      }
    },
    methods: {
      async loadPageInfo () {
        try {
          const { monitorCount } = await fetchMonitorPageInfo()
          console.log('monitorCount', monitorCount)
          // const { monitorStatus, total, negCount, date, priceAnomaly, noPic, poorWhiteRate, poorQuality, soldOut, stockAnomaly, incomplete, unCompliance, illegal, unsalable } = monitorCount
        } catch (e) {
          console.error(e)
        }
      }
    },
    created () {
      this.loadPageInfo()
    }
  }
</script>

<style lang='less'>

</style>
