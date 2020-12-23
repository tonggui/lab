<template>
  <div>
    <BreadcrumbHeader>
      配置管理
    </BreadcrumbHeader>
    <SwitchCard v-if="isMedicine" v-bind="inCompleteInfo" @change-status="handleSwitchChange" />
    <SettingInfoCard v-bind="sellOutInfo" @click="handleClick" />
  </div>
</template>
<script>
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BUSINESS_MEDICINE
  } from '@/module/moduleTypes'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import SettingInfoCard from '../components/setting-info-card'
  import SwitchCard from '../components/switch-card'

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
        inCompleteInfo: {
          title: '商品优化',
          description: '自动接受商品信息优化',
          showSwitch: true,
          status: false
        }
      }
    },
    computed: {
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE
      })
    },
    components: {
      BreadcrumbHeader,
      SettingInfoCard,
      SwitchCard
    },
    methods: {
      handleClick (listInfo) {
        this.$router.push(listInfo.link)
      },
      handleSwitchChange (status, cb) {
        const content = status ? '开关开启后，将会自动更新商品信息，商品信息包含商品名称、商品详情等；自动更新后，请关注商品是否需要修改价格、分类等信息'
          : '开关关闭后，将不再自动更新商品信息，需商家自主确认更新'
        this.inCompleteInfo = Object.assign({}, this.inCompleteInfo, { status })
        this.$Modal.confirm({
          title: '',
          content: content,
          onOk: () => {
            cb && cb()
          },
          onCancel: () => {
            this.inCompleteInfo = Object.assign({}, this.inCompleteInfo, { status: !status })
            cb && cb()
          }
        })
      }
    }
  }
</script>
