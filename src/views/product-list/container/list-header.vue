<template>
  <ListHeader :modules="modules" v-bind="$attrs" :tag-id="currentTag.id" />
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import {
    POI_RISK_CONTROL
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import ListHeader from '../components/list-header'

  const { mapGetters } = createNamespacedHelpers('productList')

  export default {
    name: 'product-list-page-header-container',
    computed: {
      ...mapGetters(['isNewPoiRecommend', 'currentTag']),
      ...mapModule({ riskControl: POI_RISK_CONTROL }),
      modules () {
        return {
          riskControl: this.riskControl,
          hotRecommend: this.isNewPoiRecommend
        }
      }
    },
    components: {
      ListHeader
    }
  }
</script>
