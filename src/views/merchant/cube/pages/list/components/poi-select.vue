<template>
  <section>
    <Trigger label="关联门店" :disabled="disabled" @show="handleShowDrawer" @clear="handleClear" :productId="productId"
             :relatedPoiIds="disabledIds" :totalPoiIds="totalPoiIds" :addedPoiIds="value" allowClear />
    <PoiSelectDrawer
      title="关联门店"
      v-model="show"
      :poiIdList="poiIds.concat(disabledIds)"
      :disabledIdList="disabledIds"
      :queryPoiList="fetchGetPoiList"
      :fetch-poi-list-by-ids="fetchPoiListByIdList"
      @on-confirm="handleConfirm"
    />
  </section>
</template>
<script>
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import Trigger from './trigger'
  import {
    fetchGetPoiList,
    fetchGetPoiInfoListByIdList
  } from '@/data/repos/merchantPoi'

  export default {
    props: {
      productId: Number,
      totalPoiIds: Array,
      value: {
        type: Array,
        default: () => ([])
      },
      disabledIds: {
        type: Array,
        default: () => ([])
      },
      disabled: Boolean
    },
    data () {
      return {
        show: false
      }
    },
    components: {
      PoiSelectDrawer,
      Trigger
    },
    computed: {
      poiIds () {
        return this.value
      }
    },
    methods: {
      triggerChange (poiIdList) {
        this.$emit('change', poiIdList)
        this.$emit('input', poiIdList)
      },
      handleShowDrawer () {
        this.show = true
      },
      handleClear () {
        this.triggerChange([])
      },
      handleConfirm (poiList) {
        let tmp = poiList.filter(item => {
          if (this.disabledIds.indexOf(item.id) === -1) {
            return item
          }
        })
        const poiIdList = tmp.map(poi => poi.id)
        if (poiIdList.length <= 0) {
          return () => {
            this.$Message.warning({
              content: '请至少选择一个需要关联的门店，否则商品无法正常创建',
              duration: 5,
              className: 'messageBoxTip'
              // top: document.body.clientHeight / 2 - 50,
              // left: document.body.clientWidth * (2 / 5) - 90
            })
            throw new Error('at least one poi')
          }
        }
        this.triggerChange(poiIdList)
      },
      fetchGetPoiList (params) {
        return fetchGetPoiList(params.name, params.pagination, params.city)
      },
      async fetchPoiListByIdList (poiIdList) {
        const data = await fetchGetPoiInfoListByIdList(this.$route.query.routerTagId, poiIdList)
        return data
      }
    }
  }
</script>

<style lang="less">
.messageBoxTip{
  top: calc(50vh - 50px);
  left: calc(50vh - 60px);
}
</style>
