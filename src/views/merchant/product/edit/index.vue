<template>
  <div>
    <Form v-if="false"/>
    <PoiSelectDrawer :value="true"/>
  </div>
</template>

<script>
  import { Spin } from '@sfe/bootes'
  import withAsyncTask from '@/hoc/withAsyncTask'
  import Form from '@/views/components/product-form/form'
  import { fetchGetTagList } from '@/data/repos/category'
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'

  export default {
    name: 'MerchantProductEdit',
    components: {
      PoiSelectDrawer,
      Form: withAsyncTask(fetchGetTagList, {
        Loading: Spin,
        key: 'tagList',
        initData: []
      })(Form)
    }
  }
</script>

<style scoped>

</style>
