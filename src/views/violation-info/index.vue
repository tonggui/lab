<template>
  <div class="violation-info">
    <div class="violation-info-header">
      <ViolationInfoBreadcrumb>门店违规信息</ViolationInfoBreadcrumb>
      <div @click="historyGoback" class="history-goback">&lt;&lt;返回</div>
    </div>
    <div class="violation-info-content">
      <Tabs v-model="activeTabType" :animated="false">
        <TabPane :label="labelFalsePrice" name="1" v-if="!isMedicine">
          <TabFalsePrice
            :active="activeTabType === VIO_TYPE.FALSE_PRICE"
            @on-refresh-tab-label-count="refreshTabLabelCount"
          />
        </TabPane>
        <TabPane :label="labelInfoViolation" name="2">
          <TabInfoViolation
            :active="activeTabType === VIO_TYPE.INFO_VIO"
            @on-refresh-tab-label-count="refreshTabLabelCount"
          />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import ViolationInfoBreadcrumb from './components/violation-info-breadcrumb'
  import TabFalsePrice from './components/tab-false-price'
  import TabInfoViolation from './components/tab-info-violation'
  import { mapModule } from '@/module/module-manage/vue'
  import { BUSINESS_MEDICINE } from '@/module/moduleTypes'
  import { VIO_TYPE } from './constants'

  export default {
    name: 'violationInfo',
    components: {
      ViolationInfoBreadcrumb,
      TabFalsePrice,
      TabInfoViolation
    },
    data () {
      return {
        VIO_TYPE,
        activeTabType: VIO_TYPE.INFO_VIO, // 1-原价虚高; 2-信息违规;
        countFalsePrice: 0, // 原价虚高商品数
        countInfoViolation: 0 // 信息违规商品数
      }
    },
    computed: {
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE
      }),
      labelFalsePrice () {
        return `原价虚高商品(${this.countFalsePrice})`
      },
      labelInfoViolation () {
        return `信息违规商品(${this.countInfoViolation})`
      }
    },
    methods: {
      historyGoback () {
        history.go(-1)
      },
      refreshTabLabelCount (countsObj) {
        const { countFalsePrice, countInfoViolation } = countsObj
        if (countFalsePrice !== undefined) {
          this.countFalsePrice = countFalsePrice
        }
        this.countInfoViolation = countInfoViolation
      }
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
