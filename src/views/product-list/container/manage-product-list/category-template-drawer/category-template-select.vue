<template>
  <CategoryTemplateSelect
    :template-list="templateList"
    :loading="loading"
    :error="error"
    :fetching-template="fetchingTemplate"
    :selected-index="selectedIndex"
    @refresh="handleRefresh"
    @refresh-template="handleRefreshTemplate"
    @cancel="handleCancel"
    @submit="handleSubmit"
    @change-index="handleTemplateIndexChange"
    @change-template="handleTemplateChange"
  />
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import CategoryTemplateSelect from '@/views/product-list/components/category-template-slect'

  const { mapActions, mapState } = createNamespacedHelpers('productList/template')

  export default {
    name: 'category-template-select-container',
    computed: {
      ...mapState(['loading', 'error', 'fetchingTemplate', 'selectedIndex', 'templateList'])
    },
    components: {
      CategoryTemplateSelect
    },
    methods: {
      ...mapActions({
        handlePreview: 'preview',
        handleCancel: 'hide',
        handleTemplateIndexChange: 'changeSelectedIndex',
        handleTemplateChange: 'changeTemplate',
        handleRefreshTemplate: 'getTemplate',
        handleRefresh: 'getOptions'
      }),
      async handleSubmit (callback) {
        await this.handlePreview()
        callback()
      }
    }
  }
</script>
