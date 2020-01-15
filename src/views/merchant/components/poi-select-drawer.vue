<template>
  <PoiSelectDrawer
    :title="title"
    :query-poi-list="handleGetPoi"
    :query-all-poi-list="handleQueryAllPoi"
    :fetch-poi-list-by-ids="handleGetPoiByIdList"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>
<script>
  // 账号 门店选择
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import {
    fetchGetPoiInfoListByIdList
  } from '@/data/repos/poi'
  import {
    fetchGetPoiList,
    fetchGetAllPoiList
  } from '@/data/repos/merchantPoi'

  export default {
    name: 'merchant-poi-select-drawer',
    props: {
      title: {
        type: String,
        default: '选择门店'
      }
    },
    components: {
      PoiSelectDrawer
    },
    methods: {
      handleGetPoi ({ pagination, name, city }) {
        return fetchGetPoiList(name, pagination, city)
      },
      handleQueryAllPoi ({ exclude = [], name, city } = {}) {
        return fetchGetAllPoiList(name, city, exclude)
      },
      handleGetPoiByIdList (poiIdList = []) {
        const routerTagId = this.$route.query.routerTagId
        return fetchGetPoiInfoListByIdList(routerTagId, poiIdList)
      }
    }
  }
</script>
