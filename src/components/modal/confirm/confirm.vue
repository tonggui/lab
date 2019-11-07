<script>
  import Modal from '../instance'

  const iconMap = {
    confirm: 'help',
    error: 'closed-thin-circle-outline',
    warning: 'error',
    success: 'check-circle-outline',
    info: 'info'
  }

  export default {
    name: 'confirm-modal',
    props: {
      type: {
        type: String,
        validator (type) {
          return ['confirm', 'error', 'success', 'info', 'warning'].includes(type)
        }
      },
      iconType: String,
      title: String,
      render: Function,
      content: String,
      renderFooter: Function
    },
    computed: {
      icon () {
        if (this.iconType) {
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
      const slots = [h('template', { slot: 'default' }), [defaultNode]]
      if (this.title) {
        const node = (
          <div style="font-size: 20px">
            { this.icon && <Icon type={this.icon} class={`icon icon-${this.type}`} size="40" /> }
            { this.title }
          </div>
        )
        slots.push(h('template', { slot: 'header' }, [node]))
      }
      if (this.renderFooter) {
        const node = this.renderFooter(h)
        slots.push(h('template', { slot: 'footer' }, [node]))
      }
      return h(Modal, {
        attrs: this.$attrs,
        on: this.$listeners
      }, [slots])
    }
  }
</script>
<style scoped lang="less">
  .icon {
    margin-right: 10px;
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
      color: @link-color;
    }
  }
</style>
