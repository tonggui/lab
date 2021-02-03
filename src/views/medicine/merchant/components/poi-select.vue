<template>
  <FormCard title="选择关联门店">
    <Trigger label="关联门店" :disabled="disabled" @show="handleShowDrawer" @clear="handleClear" :size="value.length" allowClear />
    <PoiSelectDrawer
      title="关联门店"
      v-model="show"
      :poiIdList="value"
      :query-poi-list="fetchGetPoiList"
      :query-all-poi-list="handleQueryAllPoi"
      :fetch-poi-list-by-ids="fetchPoiListByIdList"
      @on-confirm="handleConfirm"
    />
  </FormCard>
</template>
<script>
  import FormCard from '@/views/components/configurable-form/layout/form-card'
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import Trigger from '@/hoc/withBatchSelectPoi/trigger'
  import {
    fetchGetPoiList,
    fetchGetAllPoiList,
    fetchGetPoiInfoListByIdList
  } from '@/data/repos/medicineMerchantPoi'

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
      Trigger,
      FormCard
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
      handleQueryAllPoi ({ exclude = [], name, city } = {}) {
        return fetchGetAllPoiList(name, city, exclude)
      },
      async fetchPoiListByIdList (poiIdList) {
        const data = await fetchGetPoiInfoListByIdList(this.$route.query.routerTagId, poiIdList)
        return data
      }
    }
  }
</script>
