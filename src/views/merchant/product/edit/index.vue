<template>
  <div>
    <Form v-if="false"/>
    <PoiSelect :support="['search', 'input']"/>
  </div>
</template>

<script>
  import { Spin } from '@sfe/bootes'
  import withAsyncTask from '@/hoc/withAsyncTask'
  import Form from '@/views/components/product-form/form'
  import { fetchGetTagList } from '@/data/repos/category'
  import PoiSelect from '@/components/poi/poi-select'

  export default {
    name: 'MerchantProductEdit',
    components: {
      PoiSelect,
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
