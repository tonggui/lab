import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import { get } from 'lodash'
import lx from '@/common/lx/lxReport'
import { getName } from '@/hoc/helper'

/**
 * 当upc为必填但是触发了可以为不填逻辑时 值为' '
 * !!' ' === true 在接口提交时校验是否为' '
 * @type {string} ' '
 */
export const NO_UPC_EMPTY_VALUE = ' '

export default (WrapperComponent, hasFunc) => Vue.extend({
  name: getName('with-upc-switch-container', WrapperComponent),
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
  initEnable: false,
  data () {
    return {
      disable: false
    }
  },
  watch: {
    'data.commonProperty.allowUpcEmpty': {
      deep: true,
      immediate: true,
      handler (val) {
        this.disable = val
      }
    },
    disable (val) {
      if (!this.data.commonProperty) this.data.commonProperty = {}
      this.data.commonProperty.allowUpcEmpty = !!val
      this.$emit('input', val ? NO_UPC_EMPTY_VALUE : '')
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
                this.disable = true
                lx.mc({ bid: 'b_shangou_online_e_fbf53ktz_mc', val: { button_nm: buttonNm } })
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
            lx.mc({ bid: 'b_shangou_online_e_sd08qhxf_mc', val: { button_nm: 1 } })
            this.disable = false
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
    if (!hasFunc || !this.required || !this.initEnable || !this.data.editable) return forwardComponent(this, WrapperComponent)
    return h('div', [forwardComponent(this, WrapperComponent, {
      props: {
        disabled: this.disable,
        value: this.disable ? '' : this.data.upcCode,
        placeholder: this.disable ? '商品没有条形码' : ''
      }
    }), this.renderEnableUpc(h)])
  },
  created () {
    this.initEnable = get(this.data, 'commonProperty.allowUpcEmpty', false)
    this.disable = this.initEnable
    this.$emit('input', this.disable ? NO_UPC_EMPTY_VALUE : this.data.upcCode || '')
  }
})
