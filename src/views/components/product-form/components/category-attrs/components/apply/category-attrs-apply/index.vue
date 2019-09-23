<template>
  <div class="category-attrs-apply">
    <DynamicForm
      ref="form"
      :data="applyInfo"
    />
  </div>
</template>

<script>
  import DynamicFormCreator from '../dynamic-form'
  import formConfig from './config'

  export default {
    name: 'CategoryAttrsApply',
    components: { DynamicForm: DynamicFormCreator(formConfig) },
    data () {
      return {
        applyInfo: {}
      }
    }
  }
</script>

<style lang="less" scoped>
  .category-attrs-apply {
    padding: 10px 4px;
  }
</style>
