<template>
  <Modal
    :value="value"
    :title="title"
    :loading="loading"
    v-bind="$attrs"
    @on-cancel="handleCancel"
    @on-ok="handleSubmit"
  >
    <CustomForm
      v-if="showForm"
      :context="context"
      :config="config.children"
      v-model="formValue"
    />
  </Modal>
</template>
<script>
  import {
    PRODUCT_BATCH_OP, PRODUCT_SELL_STATUS
  } from '@/data/enums/product'
  import config from './config'
  import CustomForm from '@components/custom-form'

  // TODO tagList 校验
  export default {
    name: 'product-list-batch-modal',
    props: {
      value: Boolean,
      loading: Boolean,
      count: {
        type: Number,
        required: true
      },
      type: {
        type: Number,
        validator (value) {
          return Object.values(PRODUCT_BATCH_OP).includes(value)
        }
      }
    },
    data () {
      const value = (config[this.type] || {}).initValue || {}
      return {
        formValue: { ...value }
      }
    },
    watch: {
      value (value) {
        if (value) {
          const formValue = (config[this.type] || {}).initValue || {}
          this.formValue = { ...formValue }
        }
      }
    },
    computed: {
      showForm () {
        return Object.values(PRODUCT_BATCH_OP).includes(this.type)
      },
      config () {
        return config[this.type] || {}
      },
      title () {
        return this.config.title || ''
      },
      context () {
        return {
          tagList: [],
          count: this.count
        }
      }
    },
    components: {
      CustomForm
    },
    methods: {
      convert (data) {
        if (this.type === PRODUCT_BATCH_OP.PUT_ON) {
          return PRODUCT_SELL_STATUS.ON
        }
        if (this.type === PRODUCT_BATCH_OP.PUT_OFF) {
          return PRODUCT_SELL_STATUS.OFF
        }
        if (this.type === PRODUCT_BATCH_OP.MOD_STOCK) {
          return data.stock
        }
        if (this.type === PRODUCT_BATCH_OP.MOD_TIME) {
          return data.saleTime
        }
        return data
      },
      handleCancel () {
        this.$emit('cancel')
      },
      handleSubmit () {
        this.$emit('submit', this.convert(this.formValue))
      }
    }
  }
</script>
