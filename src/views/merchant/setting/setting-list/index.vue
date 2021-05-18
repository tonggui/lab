<template>
  <div>
    <BreadcrumbHeader :isMedicine="isMedicine">
      配置管理
    </BreadcrumbHeader>
    <template v-if="this.isSinglePoi">
      <IframeCard />
    </template>
    <template v-else>
      <SwitchCard v-if="isMedicine" v-bind="inCompleteInfo" @change-status="handleSwitchChange" />
      <SettingInfoCard v-else v-bind="sellOutInfo" @click="handleClick" />
    </template>
      <AutoClearStock v-bind="autoClearStockInfo" />
      <RestrictedPurchase v-bind="restrictedPurchaseInfo" />
  </div>
</template>
<script>
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BUSINESS_MEDICINE
  } from '@/module/moduleTypes'
  import { getBatchOptimizationStatus, updateBatchOptimizationStatus } from '@/data/api/medicineMerchantApi/incomplete'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import { helper } from '@/views/medicine/merchant/product/list/store'
  import SettingInfoCard from '../components/setting-info-card'
  import AutoClearStock from '../components/auto-clear-stock'
  import RestrictedPurchase from '../components/restricted-purchase'
  import SwitchCard from '../components/switch-card'
  import IframeCard from '../components/iframe-card'
  import { getIsSinglePoi } from './helper'
  const { mapActions } = helper('product')

  export default {
    data () {
      return {
        sellOutInfo: {
          title: '售罄商品订阅',
          description: '开启缺货商品允许买家订阅后，当商品缺货时，买家可以点击“缺货通知”，待商品补货后会通知买家进行下单购买',
          listInfo: {
            name: '门店列表',
            count: 0,
            link: { name: 'merchantSettingSubscriptionPoiList' }
          }
        },
        autoClearStockInfo: {
          title: '库存清0配置规则',
          description: '买家因无货取消订单后，对应的规格库存会被自动清0',
          listInfo: {
            name: '门店列表',
            count: 0,
            link: { name: 'merchantSettingSubscriptionPoiList' }
          }
        },
        restrictedPurchaseInfo: {
          title: '商品限购设置',
          description: '针对特殊商品，需要限制每个买家在周期内可购买的商品数量时，可以开启限购',
          listInfo: {
            name: '门店列表',
            count: 0,
            link: { name: 'merchantSettingSubscriptionPoiList' }
          }
        },
        inCompleteInfo: {
          title: '商品优化',
          description: '自动接受商品信息优化',
          showSwitch: true,
          status: false
        },
        isFirst: true
      }
    },
    computed: {
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE
      }),
      // 单店判断
      isSinglePoi () {
        return getIsSinglePoi(this.$route.query)
      }
    },
    components: {
      BreadcrumbHeader,
      SettingInfoCard,
      SwitchCard,
      IframeCard,
      AutoClearStock,
      RestrictedPurchase
    },
    created () {
      if (this.isMedicine && this.isFirst) {
        this.getBatchOptimizationStatus()
      }
    },
    methods: {
      ...mapActions({
        setSettingStatus: 'setSettingStatus'
      }),
      async getBatchOptimizationStatus () {
        const res = await getBatchOptimizationStatus()
        this.inCompleteInfo = Object.assign({}, this.inCompleteInfo, { status: !!res.status })
        this.isFirst = false
      },
      async updateBatchOptimizationStatus (cb) {
        const { status } = this.inCompleteInfo
        await updateBatchOptimizationStatus({
          status: Number(status)
        }).then((res) => {
          this.setSettingStatus(!!status)
        }).catch(() => {
          this.inCompleteInfo = Object.assign({}, this.inCompleteInfo, { status: !status })
        }).finally(() => {
          cb && cb()
        })
      },
      handleClick (listInfo) {
        this.$router.push({ name: listInfo.link.name, query: this.$route.query })
      },
      handleSwitchChange (status, cb) {
        const content = status ? '开关开启后，将会自动更新商品信息，商品信息包含商品名称、商品详情等；自动更新后，请关注商品是否需要修改价格、分类等信息'
          : '开关关闭后，将不再自动更新商品信息，需商家自主确认更新'
        this.inCompleteInfo = Object.assign({}, this.inCompleteInfo, { status })
        this.$Modal.confirm({
          title: '',
          content: content,
          onOk: () => {
            status ? this.signAgreement(cb) : this.updateBatchOptimizationStatus(cb)
          },
          onCancel: () => {
            this.inCompleteInfo = Object.assign({}, this.inCompleteInfo, { status: !status })
            cb && cb()
          }
        })
      },
      signAgreement (cb) {
        this.$Modal.confirm({
          width: 650,
          class: 'incomplete-agreement-modal',
          render () {
            return (
              <iframe frameBorder="0" scrolling="yes" width="100%"
              src="https://shangou.meituan.net/v1/mss_24c1e05b968a4937bf34e2f4ff68639e/shangou-fe-maker-html/sg/html/1608711161918_eb7cf6/index.html"></iframe>
            )
          },
          onCancel: () => {
            this.inCompleteInfo = Object.assign({}, this.inCompleteInfo, { status: !status })
            cb && cb()
          },
          onOk: () => {
            this.updateBatchOptimizationStatus(cb)
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .incomplete-agreement-modal {
    /deep/ .boo-modal-body {
      padding: 0;
      iframe {
        height: 552px;
      }
    }
  }
</style>
