import Vue from 'vue'
import TriggerDisplay from './trigger'
import OrderFormItem from '@components/order-form-item'
import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
import { forwardComponent } from '@/common/vnode'

export default ({ allowClear, onEmpty, onChange } = {}) => (WrapperComponent) => Vue.extend({
  props: {
    isSinglePoi: Boolean
  },
  data () {
    return {
      poiIdList: [],
      showDrawer: false
    }
  },
  methods: {
    handleClear (e) {
      e.preventDefault()
      e.stopPropagation()
      onChange && onChange([])
    },
    handleSubmit (poiList) {
      const poiIdList = (poiList || []).map(poi => poi.id)
      this.poiIdList = poiIdList
      if (!poiIdList || poiIdList.length <= 0) {
        onEmpty && onEmpty()
        return
      }
      onChange && onChange(poiIdList)
    },
    handleShowDrawer () {
      this.showDrawer = true
    }
  },
  render (h) {
    const children = []
    let index = 0
    if (!this.isSinglePoi) {
      index += 1
      children.push(
        <OrderFormItem label="选择目标门店" keyName="poiIdList" index={index}>
          <TriggerDisplay label="目标门店" vOn:click_native={this.handleShowDrawer} size={this.poiIdList.length} allowClear={allowClear} />
        </OrderFormItem>
      )
      children.push(<PoiSelectDrawer vOn:on-confirm={this.handleSubmit} vModel={this.showDrawer} />)
    }
    children.push(forwardComponent(this, WrapperComponent, { props: { poiIdList: this.poiIdList, index } }))
    return h('div', children)
  }
})
