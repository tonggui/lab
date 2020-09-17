import Vue from 'vue'
import Icon from '@/components/icon/icon'
import { isEqual } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import './index.less'

// 参考 src/views/components/product-form/components/audit-field-tip
export default (WrapperComponent) => Vue.extend({
  name: 'width-re-audit-field-tips',
  props: {
    original: [Object, Number, String, Array], // 初次获取的商品信息
    approve: [Object, Number, String, Array], // 上次提审的商品信息
    value: [Object, Number, String, Array], // 当前商品信息
    formatter: { // 格式化函数
      type: Function,
      default: (v) => v
    }
  },
  computed: {
    // 对比逻辑 审核人修改了信息 && 当前没有被用户修改，才会展示提示
    show () {
      const approve = this.formatter(this.approve)
      const original = this.formatter(this.original)
      const value = this.formatter(this.value)
      return !isEqual(approve, original) && isEqual(original, value)
    }
  },
  methods: {
    // 渲染提示
    renderTips (h) {
      if (this.show) {
        return h('div', { class: 'audit-field-tip' }, [h(Icon, { props: { type: 'error' } }), '审核人对所填信息有调整，如有误请修改并重新提交审核'])
      }
      return null
    }
  },
  render (h) {
    const content = forwardComponent(this, WrapperComponent, {
      props: {
        value: this.value,
        original: this.original,
        approve: this.approve
      }
    })
    if (!this.show) {
      return content
    }
    return h('div', { class: 'audit-field-container' }, [h('div', { class: 'audit-field' }, [content]), this.renderTips(h)])
  }
})
