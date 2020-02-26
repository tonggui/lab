<template>
  <div class="violation-info-tab-false-price">
    <div class="tips-wrapper">
      <FalsePriceTips :disabled="false">
        <p>为提升服务质量，商家在美团外卖平台发布商品的价格，不得违反法律法规或其与美团外卖签订相应协议中关于价格的相关规定/约定，包括但不限于：相同商品价格高于其他平台、高于店铺实际定价或虚高原价后再打折促销等情形/场景。一旦发现将严厉处罚（下架/删除商品、禁止活动、置休店铺、下线门店等），为避免产生处罚，请您务必点击<span class="show-detail-btn" @click="showDetail">“查看详情”</span>查看细则</p>
        <div class="false-price-tip-extra" slot="extra">
          <div class="show-detail-btn" @click="showDetail">查看详情&nbsp;&gt;</div>
        </div>
      </FalsePriceTips>
    </div>
    <Divider />
    <FalsePriceList
      v-if="!encouraging"
      :tabShowedCount="tabShowedCount"
      @refresh-tab-label-count="refreshTabLabelCount"
      @encouraging="handleEncouraging"
    />

    <EncouragingTip v-if="encouraging" />

    <Modal v-model="displayTipsModal" title="商品违规条例">
      <FalsePriceTips :disabled="true" />
      <div slot="footer">
        <Button @click="displayTipsModal = false" type="primary">我知道啦</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import EncouragingTip from './encouraging-tip'
  import FalsePriceTips from './false-price-tips'
  import FalsePriceList from './false-price-list'

  export default {
    name: 'tab-false-price',
    components: {
      EncouragingTip,
      FalsePriceTips,
      FalsePriceList
    },
    props: {
      tabShowedCount: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        displayTipsModal: false, // 展示商品违规条例弹窗
        encouraging: false // 展示【暂无违规商品记录,请继续保持!】
      }
    },
    methods: {
      showDetail () {
        this.displayTipsModal = true
      },
      refreshTabLabelCount (countsObj) {
        this.$emit('refresh-tab-label-count', countsObj)
      },
      handleEncouraging (encouraging) {
        this.encouraging = encouraging
      }
    }
  }
</script>

<style lang='less' scoped>
  .violation-info-tab-false-price {
    padding: 10px;
    .tips-wrapper {
      padding: 15px;
      margin: 20px;
      background-color: @light-background;
      border: 1px solid @color-gray5;
    }
    .show-detail-btn {
      color: @highlight-color;
      cursor: pointer;
    }
    .false-price-tip-extra {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
</style>
