<template>
  <Modal
    :value="value"
    v-bind="$attrs"
    :z-index="zIndex"
    :footer-hide="footerHide"
    @on-cancel="handleCancel"
    @on-ok="handleSubmit"
    @on-visible-change="handleVisibleChange"
    v-on="$listeners"
    transfer
  >
    <template slot="header"><slot name="header" /></template>
    <template slot="close"><slot name="close" /></template>
    <slot></slot>
    <template slot="footer"><slot name="header" /></template>
    <template slot="footer" v-if="!footerHide">
      <slot name="footer">
        <div>
          <Button @click="handleCancel">{{ cancelText }}</Button>
          <Button type="primary" @click="handleSubmit">
            <Icon type="loading" v-if="loading" />{{ okText }}
          </Button>
        </div>
      </slot>
    </template>
  </Modal>
</template>
<script>
  import { Modal } from '@roo-design/roo-vue'
  import { defaultPopperZIndex } from '@/bootes/config'

  export default {
    name: 'modal',
    props: {
      value: Boolean,
      loading: Boolean,
      cancelText: {
        type: String,
        default: '取消'
      },
      okText: {
        type: String,
        default: '确认'
      },
      footerHide: Boolean,
      zIndex: {
        type: Number,
        default: defaultPopperZIndex
      }
    },
    components: {
      Modal
    },
    methods: {
      handleCancel () {
        this.$emit('on-cancel')
      },
      handleSubmit () {
        if (this.loading) {
          return
        }
        this.$emit('on-ok')
      },
      handleVisibleChange (visible) {
        this.$emit('on-visible-change', visible)
      }
    }
  }
</script>
