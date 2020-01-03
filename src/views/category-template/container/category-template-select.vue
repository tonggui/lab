<template>
  <CategoryTemplateSelect
    :template-list="templateList"
    :loading="loading"
    :error="error"
    :selected-index="selectedIndex"
    @refresh="handleRefresh"
    @refresh-template="handleRefreshTemplate"
    @submit="handleSubmit"
    @change-index="handleTemplateIndexChange"
    @change-template="handleTemplateChange"
  />
</template>
<script>
  import { mapActions, mapState } from 'vuex'
  import CategoryTemplateSelect from '../components/category-template-select'

  export default {
    name: 'category-template-select-container',
    computed: {
      ...mapState('categoryTemplate', ['loading', 'error']),
      ...mapState('categoryTemplate/template', {
        selectedIndex: 'selectedIndex',
        templateList: 'list'
      })
    },
    components: {
      CategoryTemplateSelect
    },
    methods: {
      ...mapActions('categoryTemplate', {
        handlePreview: 'preview'
      }),
      ...mapActions('categoryTemplate/template', {
        handleTemplateIndexChange: 'changeSelectedIndex',
        handleTemplateChange: 'changeTemplateDetail',
        handleRefreshTemplate: 'loadTemplate',
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
