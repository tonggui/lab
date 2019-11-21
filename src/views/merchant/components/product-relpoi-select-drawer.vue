<template>
  <PoiSelectDrawer
    title="选择门店"
    :query-poi-list="handleGetPoi"
    :query-all-poi-list="handleQueryAllPoi"
    :fetch-poi-list-by-ids="handleGetPoiByIdList"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:search="{ search }">
      <Input placeholder="请输入门店id" v-model="poiId" style="max-width: 160px" />
      <Button type="primary" @click="search">搜索</Button>
    </template>
  </PoiSelectDrawer>
</template>
<script>
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import {
    fetchGetProductRelPoiList,
    fetchGetProductAllRelPoiList,
    fetchGetProductRelPoiListByIdList
  } from '@/data/repos/merchantProduct'

  export default {
    name: 'product-relpoi-select-drawer',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    data () {
      return { poiId: '' }
    },
    components: {
      PoiSelectDrawer
    },
    methods: {
      handleGetPoi ({ pagination }) {
        return fetchGetProductRelPoiList(this.product.id, pagination, this.poiId)
      },
      handleQueryAllPoi ({ exclude = [] } = {}) {
        return fetchGetProductAllRelPoiList(this.product.id, exclude, this.poiId)
      },
      handleGetPoiByIdList (poiIdList = []) {
        return fetchGetProductRelPoiListByIdList(this.product.id, poiIdList)
      }
    }
  }
</script>
