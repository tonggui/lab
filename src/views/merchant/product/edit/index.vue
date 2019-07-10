<template>
  <Form />
</template>

<script>
  import { Spin } from '@sfe/bootes'
  import withAsyncTask from '@/hoc/withAsyncTask'
  import Form from '@/views/components/product-form/form'
  import { fetchGetTagList } from '@/data/repos/category'

  export default {
    name: 'MerchantProductEdit',
    components: {
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
