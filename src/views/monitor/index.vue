<template>
  <div class="product-monitor">
    <BreadcrumbHeader :is-monitor="true">商品监测</BreadcrumbHeader>
    <Assessment :summary="summaryObj" extra />
    <div class="panel-wrapper" v-if="Object.keys(problemMap).length !== 0">
      <Panel v-for="l0 in level0Types" :key="l0" :problem="problemMap[l0]">
        <Section v-for="l1 in problemMap[l0].children" :key="l1">
          <div slot="header" class="section-header">{{ problemMap[l1].title }}</div>
          <Bar v-for="l2 in problemMap[l1].children" :key="l2" :problem="problemMap[l2]" />
        </Section>
      </Panel>
    </div>
    <Loading v-if="loading" size="large" />
  </div>
</template>

<script>
  import BreadcrumbHeader from '@/views/components/breadcrumb-header'
  import Assessment from './components/assessment'
  import Panel from './components/panel'
  import Section from './components/section'
  import Bar from './components/bar'
  import { fetchMonitorPageInfo } from '@/data/repos/common'
  import { PROBLEM_TYPE as TYPE, PROBLEM_DETAIL as DETAIL } from './constants'

  export default {
    name: 'monitor',
    components: {
      BreadcrumbHeader,
      Assessment,
      Panel,
      Section,
      Bar
    },
    data () {
      return {
        loading: false,
        TYPE,
        problemMap: {}, // 异常
        monitorStatus: false, // 信息正常
        total: 300, // 所有检测的商品的总量
        negCount: 115, // 所检测商品中异常的数量
        date: '2019-08-05' // 检测时间
        // priceAnomaly: 4, // 价格异常个数
        // noPic: 20, // 无图个数
        // poorWhiteRate: 20, // 非白底图个数
        // poorQuality: 14, // 质量差图个数
        // soldOut: 20, // 全部售罄个数
        // stockAnomaly: 10, // 库存异常个数
        // incomplete: 5, // 信息不全商品个数
        // unCompliance: 20, // 信息不规范商品个数
        // illegal: 16, // 违规商品个数
        // unsalable: 10 // 滞销商品个数
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
      },
      level0Types () {
        return Object.entries(DETAIL).filter(d => d[1].level === 0).map(d => d[1].id)
      }
    },
    methods: {
      async loadPageInfo () {
        try {
          this.loading = true
          const { monitorCount } = await fetchMonitorPageInfo()
          const { monitorStatus, total, negCount, date } = monitorCount
          this.monitorStatus = monitorStatus
          this.total = total
          this.negCount = negCount
          this.date = date
          for (const k in TYPE) {
            const detail = DETAIL[TYPE[k]]
            let count = 0
            if (typeof detail.count === 'object') {
              count = detail.count.reduce((acc, cur) => {
                return acc + monitorCount[cur]
              }, 0)
              detail.count = count
            } else if (typeof detail.count === 'string') {
              count = monitorCount[detail.count]
              detail.count = count
            }
            this.problemMap[TYPE[k]] = detail
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    },
    created () {
      this.loadPageInfo()
    }
  }
</script>

<style lang='less'>
.product-monitor {
  .panel-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .section-header {
      display: inline-block;
      color: #3F4156;
      padding-left: 8px;
      border-left: 4px solid #A2A4B3;
    }
  }
}
</style>
