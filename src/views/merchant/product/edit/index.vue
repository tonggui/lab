<template>
  <div>
    <Form
      :spu-id="spuId"
      :product="product"
      :preferences="preferences"
      :modules="modules"
    />
    <PoiSelectDrawer :value="drawerVisible" />
  </div>
</template>

<script>
  import { Spin } from '@sfe/bootes'
  import withAsyncTask from '@/hoc/withAsyncTask'
  import Form from '@/views/components/product-form/form'
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'

  import { fetchGetTagList } from '@/data/repos/category'
  import { fetchGetProductDetail } from '@/data/repos/merchantProduct'

  export default {
    name: 'MerchantProductEdit',
    components: {
      PoiSelectDrawer,
      Form: withAsyncTask(fetchGetTagList, {
        Loading: Spin,
        key: 'tagList',
        initData: []
      })(Form)
    },
    data () {
      return {
        drawerVisible: false,
        product: {},
        spuId: undefined
      }
    },
    computed: {
      preferences () {
        return {
          maxTagCount: 5
        }
      },
      modules () {
        return {
          shortCut: true,
          sellTime: true,
          picContent: true,
          description: true,
          suggestNoUpc: false
        }
      }
    },
    async created () {
      const spuId = +(this.$route.query.spuId || 0)
      if (spuId) {
        this.spuId = spuId
        this.product = await fetchGetProductDetail(spuId)
      }
    }
  }
</script>
