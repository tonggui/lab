import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import lx from '@/common/lx/lxReport'

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
  },
  inject: ['needAudit'],
  data () {
    return {
      disable: false
    }
  },
  watch: {
    'data.allowUpcEmpty': {
      deep: true,
      immediate: true,
      handler (val) {
        console.log('val-----------12121', val)
        this.disable = val
      }
    },
    disable (val) {
      this.data.allowUpcEmpty = !!val
      this.$emit('input', val ? 'no-upc' : '')
    }
  },
  computed: {
    isNeedAudit () {
      return this.needAudit()
    }
  },
  methods: {
    renderNoUpc (h) {
      return h('a', {
        style: {
          display: 'block',
          'text-decoration': 'underline',
          'font-size': '12px'
        },
        on: {
          click: () => {
            const buttonNm = this.isNeedAudit ? 0 : 1
            lx.mc({ bid: 'b_shangou_online_e_sd08qhxf_mc', val: { button_nm: 0 } })
            lx.mv({ bid: 'b_shangou_online_e_adry2q7n_mv', val: { button_nm: buttonNm } })
            this.$Modal.open({
              width: 420,
              title: `确定此商品没有条形码`,
              content: this.isNeedAudit ? '确定后，无需再填写条形码。若商品实际存在条形码，提交审核后将被驳回。' : '确定后，无需再填写条形码。若商品实际存在条形码，平台可能自动下架该商品。',
              closable: false,
              maskClosable: false,
              centerLayout: true,
              onOk: () => {
                console.log('点击了')
                this.disable = true
                lx.mc({ bid: 'b_shangou_online_e_fbf53ktz_mc', val: { button_nm: buttonNm } })

                // this.data.enableUpcEmpty = true
                // this.data.upcCode = ''
                // this.$emit('input', 'no-upc')
                // this.$emit('input', {
                //   ...this.data,
                //   upcCode: '',
                //   hasNoUpc: true
                // })
              },
              onCancel: () => {
                lx.mc({ bid: 'b_shangou_online_e_huxjczub_mc', val: { button_nm: buttonNm } })
              }
            })
          }
        }
      }, '商品没有条形码，请点击')
    },
    renderHasUpc (h) {
      return h('a', {
        style: {
          display: 'block',
          'text-decoration': 'underline',
          'font-size': '12px'
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
      lx.mv({ bid: 'b_shangou_online_e_s8rn8oik_mv', val: { button_nm: this.disable ? 1 : 0 } })
      return this.disable ? this.renderHasUpc(h) : this.renderNoUpc(h)
    }
  },
  render (h) {
    console.log('this.initEnable', this.initEnable, this.hasFunc, this.required)
    if (!hasFunc || !this.required || !this.initEnable) return forwardComponent(this, WrapperComponent)
    return h('div', [forwardComponent(this, WrapperComponent, {
      props: {
        disabled: this.disable,
        value: this.disable ? '' : this.data.upcCode,
        placeholder: this.disable ? '商品没有条形码' : ''
      }
    }), this.renderEnableUpc(h)])
  },
  mounted () {
    this.initEnable = this.data.commonProperty.allowUpcEmpty
    console.log('this.', this.data)
  }
})
