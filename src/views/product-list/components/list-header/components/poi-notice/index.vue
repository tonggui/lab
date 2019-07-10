<template>
  <AlertTipGroup :tipList="allNoticeList" />
</template>
<script>
  import { fetchGetPoiTipList } from '@/data/repos/poi'
  import unlinkedListPage from '@sgfe/eproduct/navigator/pages/product/unLinkedList'
  import completeProductPage from '@sgfe/eproduct/navigator/pages/product/complete'
  import withModules from '@/mixins/withModules'
  import AlertTipGroup from '@components/alert-tip/alert-tip-group'
  import {
    POI_TRANSITION_PRODUCT,
    POI_UN_RELATION_PRODUCT_COUNT
  } from '@/common/cmm'

  export default {
    name: 'poi-notice',
    mixins: [
      withModules({
        hasTransition: POI_TRANSITION_PRODUCT,
        unRelationCount: POI_UN_RELATION_PRODUCT_COUNT
      })
    ],
    data () {
      return {
        noticeList: []
      }
    },
    computed: {
      allNoticeList () {
        const list = [...this.noticeList]
        const { unRelationCount, hasTransition } = this
        if (unRelationCount > 0) {
          list.push({
            id: 'unRelationProductTip',
            content: `您有${unRelationCount}个商品不符合商品库的商品信息规范,现在去更新商品信息`,
            opreationText: '去更新',
            closable: true,
            link: { name: unlinkedListPage.name }
          })
        }
        if (hasTransition) {
          list.push({
            id: 'transitionProductTip',
            content: '您有商品需要处理后方可进行上架，请点击“现在处理”查看具体内容',
            opreationText: '现在处理',
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
