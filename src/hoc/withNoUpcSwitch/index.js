import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import { get, isFunction, set } from 'lodash'
import lx from '@/common/lx/lxReport'
import { getName } from '@/hoc/helper'
import LocalStorage from '@/common/local-storage'

const UPC_RENDERED = 'upc_rendered'
/**
 * 当upc为必填但是触发了可以为不填逻辑时 值为' '
 * !!' ' === true 在接口提交时校验是否为' '
 * @type {string} ' '
 */

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
    required: {
      immediate: true,
      handler (val) {
        if (!val) {
          if (this.data.commonProperty && 'allowUpcEmpty' in this.data.commonProperty) this.data.commonProperty = null
        }
      }
    },
    disable (val) {
      console.log(66666, val, this.data)
      if (val) set(this.data, 'commonProperty.allowUpcEmpty', !!val)
      else set(this.data, 'commonProperty', null)

      if (val) this.$emit('input', '')
      // if (!this.data.commonProperty) this.data.commonProperty = {}
      // this.data.commonProperty.allowUpcEmpty = !!val
      // this.$emit('input', val ? NO_UPC_EMPTY_VALUE : '')
    }
  },
  computed: {
    isNeedAudit () {
      if (isFunction(this.needAudit)) return this.needAudit()
      else return false
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
              content: '确定后，无需再填写条形码。若商品实际存在条形码，可能被审核驳回或自动下架',
              closable: false,
              maskClosable: false,
              centerLayout: true,
              onOk: () => {
                this.disable = true
                lx.mc({ bid: 'b_shangou_online_e_fbf53ktz_mc', val: { button_nm: buttonNm } })
                lx.mv({ bid: 'b_shangou_online_e_s8rn8oik_mv', val: { button_nm: 0 } })
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
            lx.mv({ bid: 'b_shangou_online_e_s8rn8oik_mv', val: { button_nm: 1 } })
            this.disable = false
          }
        }
      }, '商品有条形码，请点击')
    },
    renderEnableUpc (h) {
      return this.disable ? this.renderHasUpc(h) : this.renderNoUpc(h)
    }
  },
  render (h) {
    if (!hasFunc || !this.required || !this.data.editable) return forwardComponent(this, WrapperComponent)
    return h('div', [forwardComponent(this, WrapperComponent, {
      props: {
        disabled: this.disable,
        value: this.disable ? '' : this.data.upcCode,
        placeholder: this.disable ? '商品没有条形码' : ''
      }
    }), this.renderEnableUpc(h)])
  },
  created () {
    // 初始是否存在此功能
    this.initEnable = get(this.data, 'commonProperty.allowUpcEmpty', false)
    this.disable = this.initEnable
    if (this.disable) {
      // TODO hack方法
      if (!LocalStorage[UPC_RENDERED]) {
        lx.mv({ bid: 'b_shangou_online_e_adry2q7n_mv', val: { button_nm: 1 } })
        LocalStorage[UPC_RENDERED] = true
      }
      this.$emit('input', '')
    }
  }
})
