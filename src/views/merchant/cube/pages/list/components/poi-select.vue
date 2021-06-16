<template>
  <section>
    <Trigger label="关联门店" :disabled="disabled" @show="handleShowDrawer" @clear="handleClear" :size="value.length" allowClear />
    <PoiSelectDrawer
      title="关联门店"
      v-model="show"
      :poiIdList="value"
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
      value: {
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
        const poiIdList = poiList.map(poi => poi.id)
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
