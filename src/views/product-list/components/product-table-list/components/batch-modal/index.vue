<template>
  <Modal
    :value="value"
    :title="title"
    :loading="loading"
    v-bind="$attrs"
    @on-hidden="handleHidden"
    @on-cancel="handleCancel"
    @on-ok="triggerSubmit"
  >
    <template v-if="isForm">
      <Alert v-show="error" type="error">{{ error }}</Alert>
      <div>共选择 {{ count }} 件商品</div>
      <component ref="form" v-if="showForm" :tag-list="tagList" :is="component" @submit="handleSubmit"></component>
    </template>
    <template v-else>
      <div>{{ confirm }}</div>
    </template>
  </Modal>
</template>
<script>
  import {
    PRODUCT_BATCH_OP
  } from '@/data/enums/product'
  import config from './config.js'

  export default {
    name: 'product-list-batch-modal',
    props: {
      value: Boolean,
      loading: Boolean,
      type: {
        type: Number,
        validator (value) {
          return Object.values(PRODUCT_BATCH_OP).includes(value)
        }
      },
      count: {
        type: Number,
        default: 0
      },
      tagList: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        error: ''
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
      component () {
        return this.config.component
      },
      isForm () {
        return this.config.type === 'form'
      },
      confirm () {
        return this.config.confirm && this.config.confirm({ count: this.count })
      }
    },
    methods: {
      handleCancel () {
        this.$emit('cancel')
      },
      handleHidden () {
        this.error = ''
      },
      triggerSubmit () {
        if (this.isForm) {
          this.$refs.form.submit()
        } else {
          this.$emit('submit', this.config.value)
        }
      },
      handleSubmit (error, value) {
        if (error) {
          this.error = error
          this.$Message.error(error)
          return
        }
        this.$emit('submit', value)
      }
    }
  }
</script>
