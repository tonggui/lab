import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'

export default (WrapperComponent, hasFunc) => Vue.extend({
  name: '_UpcCodeWithDisableContainer_',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    required: {
      type: Boolean,
      default: false
    }
    // needAudit: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data () {
    return {
      disable: false
    }
  },
  watch: {
    'data.enableUpcEmpty': {
      deep: true,
      immediate: true,
      handler (val) {
        console.log('val-----------12121', val)
        this.disable = val
      }
    },
    disable (val) {
      this.data.enableUpcEmpty = !!val
      this.$emit('input', val ? 'no-upc' : '')
    }
  },
  methods: {
    renderNoUpc (h) {
      return h('small', {
        style: {
          display: 'block'
        },
        on: {
          click: () => {
            this.$Modal.open({
              width: 420,
              title: `确定此商品没有条形码`,
              content: this.needAudit ? '确定后，无需再填写条形码。若商品实际存在条形码，提交审核后将被驳回。' : '确定后，无需再填写条形码。若商品实际存在条形码，平台可能自动下架该商品。',
              closable: false,
              maskClosable: false,
              centerLayout: true,
              onOk: () => {
                console.log('点击了')
                this.disable = true
                // this.data.enableUpcEmpty = true
                // this.data.upcCode = ''
                // this.$emit('input', 'no-upc')
                // this.$emit('input', {
                //   ...this.data,
                //   upcCode: '',
                //   hasNoUpc: true
                // })
              }
            })
          }
        }
      }, '商品没有条形码，请点击')
    },
    renderHasUpc (h) {
      return h('small', {
        style: {
          display: 'block'
        },
        on: {
          click: () => {
            this.disable = false
            // this.data.enableUpcEmpty = false
            // this.$emit('input', '')
            // this.$emit('input', {
            //   ...this.data,
            //   hasNoUpc: false
            // })
          }
        }
      }, '商品有条形码，请点击')
    },
    renderEnableUpc (h) {
      console.log('this.disable', this.disable)
      return this.disable ? this.renderHasUpc(h) : this.renderNoUpc(h)
    }
  },
  render (h) {
    console.log('加载了', this.required, this.data)
    if (!hasFunc || !this.required) return forwardComponent(this, WrapperComponent)
    return h('div', [forwardComponent(this, WrapperComponent, {
      props: {
        disabled: this.disable,
        value: this.disable ? '' : this.data.upcCode,
        placeholder: this.disable ? '商家反馈此商品无条形码' : ''
      }
    }), this.renderEnableUpc(h)])
  }
})
