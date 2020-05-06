<template>
  <div>
    <BreadcrumbHeader>
      配置管理
    </BreadcrumbHeader>
    <SettingInfoCard v-bind="sellOutInfo" @click="handleClick" />
  </div>
</template>
<script>
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import SettingInfoCard from '../components/setting-info-card'

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
        }
      }
    },
    components: {
      BreadcrumbHeader,
      SettingInfoCard
    },
    methods: {
      handleClick (listInfo) {
        this.$router.push(listInfo.link)
      }
    }
  }
</script>
