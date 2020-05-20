<template>
  <Modal
    :value="value"
    v-bind="$attrs"
    :z-index="zIndex"
    :footer-hide="footerHide"
    :title="title"
    @on-cancel="handleCancel"
    @on-ok="handleSubmit"
    @on-visible-change="handleVisibleChange"
    @input="handleInput"
    @on-hidden="$emit('on-hidden')"
    transfer
    ref="modal"
    class="custom-modal"
    :class-name="classNames"
    :data-bg-type="headBackgroundType"
  >
    <template slot="header">
      <slot name="header">
        <div class="modal-head" :class="{ 'center': centerLayout }" v-if="showTitle">
          <div class="modal-head-title" :class="{ 'center': centerLayout  }">
            <slot name="title">{{ title }}</slot>
          </div>
        </div>
      </slot>
    </template>
    <template slot="close">
      <slot name="close">
        <Icon type="closed" color="#999" @click.stop="handleClose"></Icon>
      </slot>
    </template>
    <slot></slot>
    <template slot="footer" v-if="!footerHide">
      <slot name="footer">
        <div class="modal-footer" :class="{ center: centerLayout }">
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
  import ClassNames from 'classnames'
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
      },
      title: String,
      centerLayout: Boolean,
      headBackgroundType: {
        type: String,
        validator (type) {
          return ['success', 'warning'].includes(type)
        }
      },
      verticalCenter: Boolean,
      className: String
    },
    components: {
      Modal
    },
    data () {
      return {
        submitting: this.loading || false,
        showTitle: !!this.title
      }
    },
    computed: {
      classNames () {
        return ClassNames({
          [this.className]: true,
          'vertical-center': this.verticalCenter
        })
      }
    },
    watch: {
      loading (loading) {
        this.submitting = loading
      }
    },
    updated () {
      let showHead
      const showTitle = this.title || this.$slots.title
      if (this.showTitle !== showTitle) {
        this.showTitle = showTitle
      }
      if (!this.$slots.header && !showTitle) {
        showHead = false
      } else {
        showHead = true
      }
      if (this.$refs.modal) {
        this.$refs.modal.showHead = showHead
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
      handleClose () {
        this.$emit('on-close')
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
        }, () => {
          if (isNoLoading) {
            this.submitting = false
          }
        }))
      },
      handleVisibleChange (visible) {
        this.$emit('on-visible-change', visible)
      }
    }
  }
</script>
<style lang="less" scoped>
  .custom-modal {
    &[data-bg-type="warning"],
    &[data-bg-type="success"] {
      /deep/ .boo-modal-header {
        position: relative;
        color: #fff;
        overflow: hidden;
        &::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          width: 88px;
          height: 88px;
          background-repeat: no-repeat;
          background-size: 88px 88px;
        }
      }
      .modal-head.center {
        border: none;
      }
    }
    &[data-bg-type="warning"] /deep/ .boo-modal-header {
      background-image: linear-gradient(135deg, #FFBC52 0%, #F89800 100%);
      &::before {
        background-image: url('../img/warning.svg');
      }
    }
    &[data-bg-type="success"] /deep/ .boo-modal-header {
      background-image: linear-gradient(135deg, #6DCFB2 0%, #5AB6EB 100%);
      &::before {
        background-image: url('../img/success.svg');
      }
    }
    /deep/ .modal-head {
      &.center {
        border-bottom: 1px solid @border-color-base;
        padding-bottom: 20px;
        text-align: center;
        .modal-head-title {
          font-size: 20px;
          font-family: PingFangSC-Medium;
        }
      }
      .modal-head-title {
        font-size: 18px;
      }
    }
    /deep/ .modal-footer.center {
      text-align: center;
      margin-top: -20px;
    }
    /deep/ .vertical-center {
      display: flex;
      align-items: center;
      justify-content: center;

      /deep/ .boo-modal {
          top: 0;
      }
    }
  }
</style>
