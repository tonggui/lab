<template>
  <Modal
    :value="value"
    v-bind="$attrs"
    :z-index="zIndex"
    :footer-hide="footerHide"
    @on-cancel="handleCancel"
    @on-ok="handleSubmit"
    @on-visible-change="handleVisibleChange"
    @input="handleInput"
    @on-hidden="$emit('on-hidden')"
    transfer
  >
    <template slot="header" v-if="$slots.header"><slot name="header" /></template>
    <template slot="close">
      <slot name="close">
        <Icon type="closed" color="#999"></Icon>
      </slot>
    </template>
    <slot></slot>
    <template slot="footer" v-if="!footerHide">
      <slot name="footer">
        <div>
          <Button @click="handleCancel" v-if="showCancel">{{ cancelText }}</Button>
          <Button type="primary" @click="handleSubmit" :loading="submitting">
            {{ okText }}
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
      loading: {
        type: [Boolean, undefined],
        default: undefined
      },
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
      },
      showCancel: {
        type: Boolean,
        default: true
      },
      createCallback: {
        type: Function,
        default: success => success
      }
    },
    components: {
      Modal
    },
    data () {
      return {
        submitting: this.loading || false
      }
    },
    watch: {
      loading (loading) {
        this.submitting = loading
      }
    },
    methods: {
      triggerVisible (v) {
        this.$emit('input', v)
        this.$emit('on-visible-change', v)
      },
      handleInput (v) {
        this.triggerVisible(v)
      },
      handleCancel () {
        this.$emit('on-cancel')
        this.triggerVisible(false)
      },
      handleSubmit () {
        if (this.loading) {
          return
        }
        if (!this.$listeners['on-ok']) {
          this.triggerVisible(false)
          return
        }
        const isNoLoading = this.loading === undefined
        if (isNoLoading) {
          this.submitting = true
        }
        this.$emit('on-ok', this.createCallback(() => {
          if (isNoLoading) {
            this.submitting = false
            this.triggerVisible(false)
          }
        }, (err) => {
          if (isNoLoading) {
            this.submitting = false
          }
          this.$Message.warning(err.message)
        }))
      },
      handleVisibleChange (visible) {
        this.$emit('on-visible-change', visible)
      }
    }
  }
</script>
