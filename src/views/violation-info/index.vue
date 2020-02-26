<template>
  <div class="violation-info">
    <div class="violation-info-header">
      <ViolationInfoBreadcrumb>门店违规信息</ViolationInfoBreadcrumb>
      <div @click="historyGoback" class="history-goback">&lt;&lt;返回</div>
    </div>
    <div class="violation-info-content">
      <Tabs v-model="activeTabType" :animated="false" @on-click="handleTabsChange">
        <TabPane :label="labelFalsePrice" name="1" v-if="!isMedicine">
          <TabFalsePrice
            :tabShowedCount="tabShowedCountFalsePrice"
            @refresh-tab-label-count="refreshTabLabelCount"
          />
        </TabPane>
        <TabPane :label="labelInfoViolation" name="2">
          <TabInfoViolation :tabShowedCount="tabShowedCountInfoViolation" />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import ViolationInfoBreadcrumb from './components/violation-info-breadcrumb'
  import TabFalsePrice from './components/tab-false-price'
  import TabInfoViolation from './components/tab-info-violation'
  import { getIsMedicine } from '@/common/constants'

  export default {
    name: 'violationInfo',
    components: {
      ViolationInfoBreadcrumb,
      TabFalsePrice,
      TabInfoViolation
    },
    data () {
      return {
        activeTabType: '1', // 1-原价虚高; 2-信息违规;
        countFalsePrice: 0, // 原价虚高商品数
        countInfoViolation: 0, // 信息违规商品数
        tabShowedCountFalsePrice: 0, // 原价虚高tab展示次数，用作切换tab后拉取数据
        tabShowedCountInfoViolation: 0 // 信息违规tab展示次数，用作切换tab后拉取数据
      }
    },
    computed: {
      isMedicine () {
        return getIsMedicine()
      },
      labelFalsePrice () {
        return `原价虚高商品(${this.countFalsePrice})`
      },
      labelInfoViolation () {
        return `信息违规商品(${this.countInfoViolation})`
      }
    },
    watch: {},
    methods: {
      historyGoback () {
        history.go(-1)
      },
      handleTabsChange (name) {
        if (+name === 1) {
          ++this.tabShowedCountFalsePrice
        } else if (+name === 2) {
          ++this.tabShowedCountInfoViolation
        }
      },
      refreshTabLabelCount (countsObj) {
        const { countFalsePrice, countInfoViolation } = countsObj
        this.countFalsePrice = countFalsePrice
        this.countInfoViolation = countInfoViolation
      }
    },
    created () {
    }
  }
</script>

<style lang='less' scoped>
.violation-info {
  .violation-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .history-goback {
      color: @link-hover-color;
    }
  }

  .violation-info-content {
    background-color: @component-bg;
    min-height: 740px;
    .boo-tabs-bar {
      margin-bottom: 0;
    }
  }
}
</style>
