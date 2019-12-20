<template>
  <CategoryTemplateSelect
    :template-list="templateList"
    :loading="loading"
    :error="error"
    :fetching-template="fetchingTemplate"
    :selected-index="selectedIndex"
    @refresh="handleRefresh"
    @refresh-template="handleRefreshTemplate"
    @submit="handleSubmit"
    @change-index="handleTemplateIndexChange"
    @change-template="handleTemplateChange"
  />
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import CategoryTemplateSelect from '../components/category-template-select'

  const { mapActions, mapState } = createNamespacedHelpers('categoryTemplate')

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
        handleTemplateIndexChange: 'changeSelectedIndex',
        handleTemplateChange: 'changeTemplate',
        handleRefreshTemplate: 'getTemplate',
        handleRefresh: 'getOptions'
      }),
      async handleSubmit (callback) {
        try {
          await this.handlePreview()
        } catch (err) {
          this.$Message.error(err.message)
        } finally {
          callback && callback()
        }
      }
    }
  }
</script>
