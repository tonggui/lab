import Vue from 'vue'
import { find, get } from 'lodash'
import { cloneElement, forwardComponent } from '@/common/vnode'
import { diffSkuBySpec } from '@/common/product/audit'
import './index.less'

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
        h('p', { class: 'correct-desc' }, [`修改前：${this.originalValueText || '空'}`])
      ]) : null
    ])
  }
})

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
    needCorrectionAudit: Boolean
  },
  computed: {
    // 对比逻辑，触发纠错，并且 当前值和初始值不一致
    show () {
      return this.needCorrectionAudit && diffSkuBySpec(this.original, this.value)
    }
  },
  methods: {
    findOriginalSku (row) {
      return find(this.original, ['upcCode', row.upcCode])
    },
    mergeSpecName (config) {
      const { render, ...others } = config
      return {
        ...others,
        render: (h, col) => {
          const childNode = render(h, col)
          const { row } = col
          let originValue = null
          let active = false
          if (this.show) {
            originValue = get(this.findOriginalSku(row), 'specName')
            console.log(this.show, originValue, this.original, row)
            active = originValue !== row.specName
          }
          return h(DiffTableCellContainer, {
            props: {
              active,
              originalValueText: originValue
            },
            scopedSlots: {
              content: () => childNode
            }
          })
        }
      }
    }
  },
  render () {
    return forwardComponent(this, WrapperComponent, {
      props: {
        value: this.value,
        columnConfig: {
          specName: this.mergeSpecName
        }
      }
    })
  }
})
