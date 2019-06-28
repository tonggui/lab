<template>
  <div class="edit-form">
    <Button type="primary" @click="fetchData" :loading="loading">获取数据</Button>
    <iSwitch v-model="formContext.isMedicine" @on-change="handleSwitch"></iSwitch>
    <DynamicForm :data="formData" :formConfig="formConfig" :context="formContext"></DynamicForm>
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
      context: {
        isMedicine: false
      },
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
      return getContext(this.context, this.handleContextChange)
    }
  },
  methods: {
    handleContextChange (key, value) {
      this.context[key] = value
    },
    handleSwitch (v) {
      this.formContext.isMedicine = v
    },
    fetchData () {
      this.loading = true
      setTimeout(() => {
        this.formData = {
          upc: '123123121',
          name: '美团闪购666',
          isMedicine: true,
          labels: [1, 2]
        }
        this.loading = false
      }, 1000)
    }
  }
}
</script>
