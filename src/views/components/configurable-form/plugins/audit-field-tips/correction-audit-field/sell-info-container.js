import Vue from 'vue'
import { find, get, isEqual } from 'lodash'
import { cloneElement, forwardComponent } from '@/common/vnode'
import { diffSkuByUpc } from '@/common/product/audit'
import './index.less'
import { SKU_FIELD } from '@/views/components/configurable-form/field'

// 具体用法查看中的clone处理逻辑
// /src/views/components/product-form/components/sell-info/components/descartes-table/cell
const DiffTableCellContainer = Vue.extend({
  name: 'DiffTableCellContainer',
  props: {
    // 解决层级变化导致DOM切换引起的光标丢失问题
    active: Boolean,
    originalValueText: String
  },
  render (h) {
    const contentScope = this.$scopedSlots.content
    const content = cloneElement(contentScope(), {
      props: {
        ...this.$attrs
      },
      on: this.$listeners
    })
    return h('div', { class: 'correction-audit-field-container' }, [
      h('div', { class: 'correction-audit-field' }, [content]),
      this.active ? h('div', { class: 'correction-audit-field-tip' }, [
        h('p', { class: 'popper' }, [h('div', { class: 'popper-arrow' }), '修改需审核']),
        h('p', { class: 'desc' }, [`修改前：${this.originalValueText || '空'}`])
      ]) : null
    ])
  }
})

const cfgKeyMap = {
  weight: ['weight.value', 'weight.unit'],
  price: ['price.value', 'price.unit']
}

// 参考 src/views/components/product-form/components/audit-field-tip
export default (WrapperComponent) => Vue.extend({
  name: 'width-sell-info-correction-audit-tips',
  props: {
    original: [Object, Number, String, Array],
    value: [Object, Number, String, Array],
    formatter: {
      type: Function,
      default: (v) => v
    },
    needCorrectionAudit: Boolean,
    complianceNeedAuditTip: Boolean,
    needAuditList: Array
  },
  computed: {
    // 对比逻辑，触发纠错，并且 当前值和初始值不一致
    show () {
      return (this.needCorrectionAudit && diffSkuByUpc(this.original, this.value)) || this.complianceNeedAuditTip
    }
  },
  methods: {
    // 渲染提示
    renderTips (h, tipText = this.formatter(this.original)) {
      console.log(tipText)
      return h('div', { class: 'correction-audit-field-tip' }, [
        h('p', { class: 'popper' }, [h('div', { class: 'popper-arrow' }), '修改需审核']),
        h('p', { class: 'desc' }, [`修改前：${tipText || '空'}`])
      ])
    },
    renderContentWithTip (h, content, tipText) {
      return h('div', { class: 'correction-audit-field-container' }, [
        h('div', { class: 'correction-audit-field' }, [content]),
        this.renderTips(h, tipText)
      ])
    },
    isValidSku () { return true },
    findOriginalSku (id) {
      return find(this.original, ['id', id])
    },
    mergeConfig (config, key) {
      key = cfgKeyMap[key] || key
      const { render, ...others } = config
      return {
        ...others,
        render: (h, col) => {
          const childNode = render(h, col)
          const { row } = col
          let originValue = null
          let active = false
          if (this.show && this.isValidSku(row)) {
            if (Array.isArray(key)) {
              originValue = key.map(v => get(this.findOriginalSku(row.id), v, '')).join('')
              active = originValue !== key.map(v => get(row, v, '')).join('')
            } else {
              originValue = get(this.findOriginalSku(row.id), key, '')
              if (typeof originValue === 'object') {
                active = !isEqual(originValue, row[key])
                originValue = Object.keys(originValue).map(v => originValue[v]).join('和')
              } else {
                active = originValue !== row[key]
              }
            }
          }
          return h(DiffTableCellContainer, {
            props: {
              active,
              originalValueText: `${originValue}`
            },
            scopedSlots: {
              content: () => childNode
            }
          })
        }
      }
    },
    getCfg () {
      return Object.values(SKU_FIELD).filter(key => (this.complianceNeedAuditTip && this.needAuditList.includes(key)) || key === 'upcCode').reduce((prev, next) => {
        prev[next] = cfg => this.mergeConfig(cfg, next)
        return prev
      }, {})
    }
  },
  render () {
    return forwardComponent(this, WrapperComponent, {
      props: {
        value: this.value,
        columnConfig: this.getCfg()
      }
    })
  }
})
