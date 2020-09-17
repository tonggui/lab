<template>
  <PoiSelectDrawer
    :title="title"
    :query-poi-list="handleGetPoi"
    :query-all-poi-list="handleQueryAllPoi"
    :fetch-poi-list-by-ids="handleGetPoiByIdList"
    :input-poi-max="inputPoiMax"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>
<script>
  // 账号 门店选择
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import {
    fetchGetPoiList,
    fetchGetAllPoiList,
    fetchGetPoiInfoListByIdList
  } from '@/data/repos/merchantPoi'
  import { REL_POI_MAX_SIZE } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  export default {
    name: 'merchant-poi-select-drawer',
    props: {
      title: {
        type: String,
        default: '选择门店'
      }
    },
    computed: {
      ...mapModule({
        inputPoiMax: REL_POI_MAX_SIZE
      })
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
