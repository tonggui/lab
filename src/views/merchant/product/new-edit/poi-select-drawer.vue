<template>
  <PoiSelectDrawer
    title="关联门店"
    :value="value"
    :queryPoiList="fetchGetPoiList"
    :fetch-poi-list-by-ids="fetchPoiListByIdList"
    @on-confirm="$listeners['on-confirm']"
    @on-visible-change="$listeners['on-visible-change']"
  />
</template>
<script>
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import {
    fetchGetPoiList
  } from '@/data/repos/merchantPoi'
  import {
    fetchGetPoiInfoListByIdList
  } from '@/data/repos/poi'

  export default {
    props: {
      value: Boolean
    },
    components: {
      PoiSelectDrawer
    },
    methods: {
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
