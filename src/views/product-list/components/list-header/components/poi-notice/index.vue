<template>
  <AlertTipGroup :tipList="allNoticeList" />
</template>
<script>
  import { fetchGetPoiTipList } from '@/data/repos/poi'
  import completeProductPage from '@sgfe/eproduct/navigator/pages/product/complete'
  import AlertTipGroup from '@components/alert-tip/alert-tip-group'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    POI_TRANSITION_PRODUCT,
    POI_AUDIT_STATUS
  } from '@/module/moduleTypes'
  import { STATUS as AUDIT_STATUS } from '@/data/enums/poi'

  export default {
    name: 'poi-notice',
    data () {
      return {
        noticeList: []
      }
    },
    computed: {
      ...mapModule({
        hasTransition: POI_TRANSITION_PRODUCT,
        status: POI_AUDIT_STATUS
      }),
      allNoticeList () {
        if (status === AUDIT_STATUS.AUDITING) {
          return this.noticeList
        }
        const list = [...this.noticeList]
        const { hasTransition } = this
        if (hasTransition) {
          list.push({
            id: 'transitionProductTip',
            content: '您有商品需要处理后方可进行上架，请点击“现在处理”查看具体内容',
            operationText: '现在处理',
            closable: false,
            link: { name: completeProductPage.name }
          })
        }
        return list
      }
    },
    components: {
      AlertTipGroup
    },
    mounted () {
      fetchGetPoiTipList().then(data => { this.noticeList = data })
    }
  }
</script>
