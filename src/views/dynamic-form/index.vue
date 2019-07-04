<template>
  <div class="edit-form">
    <Button type="primary" @click="fetchData" :loading="loading" style="margin-right: 20px">获取数据</Button>
    <iSwitch :value="formContext.isMedicine" @on-change="handleSwitch"></iSwitch>
    <DynamicForm ref="form" :data="formData" :formConfig="formConfig" :context="formContext"></DynamicForm>
  </div>
</template>

<script>
import DynamicForm from '@/components/dynamic-form'
import { getContext } from '@/components/dynamic-form/context'
import { getFormConfig } from './formConfig'
import EditInput from '@/components/edit-input/edit-input'
import ProductLabels from './components/product-labels'

export default {
  name: 'edit-form',
  components: { DynamicForm: DynamicForm({ EditInput, ProductLabels }) },
  data () {
    return {
      loading: false,
      formConfig: getFormConfig(),
      formData: {
        upc: '',
        name: '',
        isMedicine: false,
        labels: []
      }
    }
  },
  computed: {
    formContext () {
      return getContext({ isMedicine: false })
    }
  },
  methods: {
    handleSwitch (v) {
      this.formContext.isMedicine = v
    },
    fetchData () {
      this.loading = true
      setTimeout(() => {
        this.formData = {
          upc: '123123121',
          name: '美团闪购666',
          labels: [1, 2]
        }
        this.formContext.isMedicine = true
        this.loading = false
      }, 1000)
    }
  },
  mounted () {
    window.form = this.$refs.form
  }
}
</script>

<style lang="less" scoped>
.edit-form {
  padding: 20px 0 100px;
}
</style>
