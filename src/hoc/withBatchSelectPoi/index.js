import Vue from 'vue'
import TriggerDisplay from './trigger'
import OrderFormItem from '@components/order-form-item'
import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
import { forwardComponent } from '@/common/vnode'
import {
  fetchGetPoiList,
  fetchGetPoiInfoListByIdList
} from '@/data/repos/poi'

export default ({ allowClear, onEmpty, onChange } = {}) => (WrapperComponent) => Vue.extend({
  props: {
    isSinglePoi: Boolean,
    routerTagId: [Number, String],
    isBusinessClient: Boolean
  },
  data () {
    return {
      poiIdList: [],
      showDrawer: false
    }
  },
  computed: {
    poiSelectType () {
      if (this.isBusinessClient) {
        return ['search']
      }
      return ['input']
    }
  },
  methods: {
    async getPoiList ({ name, pagination, city } = {}) {
      try {
        const data = await fetchGetPoiList(name, pagination, city, this.routerTagId)
        return data
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message || '门店获取失败')
      }
    },
    async getPoiInfoListByIdList (poiIdList) {
      try {
        const data = await fetchGetPoiInfoListByIdList(this.routerTagId, poiIdList)
        return data
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message || '门店查询失败')
      }
    },
    handleClear () {
      this.poiIdList = []
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
          <TriggerDisplay label="目标门店" onShow={this.handleShowDrawer} onClear={this.handleClear} size={this.poiIdList.length} allowClear={allowClear} />
        </OrderFormItem>
      )
      children.push(<PoiSelectDrawer support={this.poiSelectType} poiIdList={this.poiIdList} vOn:on-confirm={this.handleSubmit} vModel={this.showDrawer} title="选择目标门店" queryPoiList={this.getPoiList} supportSelectAll={false} fetchPoiListByIds={this.getPoiInfoListByIdList} />)
    }
    children.push(forwardComponent(this, WrapperComponent, { props: { poiIdList: this.poiIdList, index, isSinglePoi: this.isSinglePoi } }))
    return h('div', children)
  }
})