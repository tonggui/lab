<script>
  import Modal from '../instance'
  import ClassNames from 'classnames'

  const iconMap = {
    confirm: 'help',
    error: 'closed-thin-circle-outline',
    warning: 'error',
    success: 'check-circle-outline',
    info: 'info'
  }
  const typeList = ['confirm', 'error', 'success', 'info', 'warning']

  export default {
    name: 'confirm-modal',
    props: {
      type: {
        type: String,
        validator (type) {
          return typeList.includes(type)
        }
      },
      iconType: String,
      title: String,
      render: Function,
      content: String,
      renderFooter: Function,
      value: Boolean,
      centerLayout: Boolean,
      renderTitle: {
        type: Function,
        default: () => {}
      }
    },
    computed: {
      icon () {
        if (this.iconType !== undefined) {
          return this.iconType
        }
        return iconMap[this.type]
      }
    },
    components: {
      Modal
    },
    render (h) {
      const defaultNode = this.render ? this.render(h) : (<div domProps={{ innerHTML: this.content }}></div>)
      const slots = []
      const children = <div class="modal-confirm-body">{ defaultNode }</div>
      if (this.title && this.icon) {
        const node = (
          <div class="modal-confirm-head">
            { this.icon && <Icon type={this.icon} class={`icon icon-${this.type}`} size="34" /> }
            <div class="boo-modal-confirm-head-title">{ this.title }</div>
          </div>
        )
        slots.push(h('template', { slot: 'header' }, [node]))
      } else if (this.renderTitle) {
        const content = this.renderTitle()
        if (content) {
          slots.push(h('template', { slot: 'title' }, [content]))
        }
      }
      if (this.renderFooter) {
        const node = this.renderFooter(h)
        slots.push(h('template', { slot: 'footer' }, [node]))
      }
      const className = ClassNames({
        'modal-confirm': typeList.includes(this.type) && !this.centerLayout,
        'has-icon': this.title && this.icon
      })
      return h(Modal, {
        attrs: { className, title: this.title, centerLayout: this.centerLayout, ...this.$attrs },
        props: { value: this.value },
        on: this.$listeners
      }, [children, slots])
    }
  }
</script>
<style lang="less">
  .modal-confirm {
    .boo-modal-content {
      padding: 30px 30px 0 30px;
      .boo-modal-header {
        padding-top: 20px;
      }
      .boo-modal-body {
        padding-top: 0;
        padding-left: 20px;
      }
      .boo-modal-footer {
        padding-right: 0;
        padding-left: 0;
      }
    }
    &.has-icon .boo-modal-body {
      margin-left: 52px;
    }
    &-head {
      .boo-modal-confirm-head-title {
        margin-left: 0;
      }
      .icon {
        margin-right: 20px;
        display: inline-block;
        font-size: 34px;
        vertical-align: middle;
        position: relative;
        &-success {
          color: @success-color;
        }
        &-warning {
          color: @warning-color;
        }
        &-error {
          color: @error-color;
        }
        &-info {
          color: @info-color;
        }
        &-confirm {
          color: @warning-color;
        }
      }
      &-title {
        display: inline-block;
        vertical-align: middle;
        font-size: 18px;
        color: @text-color;
        font-weight: 500;
      }
    }
  }
</style>
