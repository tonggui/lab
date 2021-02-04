<template>
  <PoiSelectDrawer
    title="选择门店"
    :query-poi-list="handleGetPoi"
    :query-all-poi-list="handleQueryAllPoi"
    :fetch-poi-list-by-ids="handleGetPoiByIdList"
    :input-poi-max="inputPoiMax"
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
  // 商品关联的 门店 选择
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import {
    fetchGetProductRelPoiList,
    fetchGetProductAllRelPoiList,
    fetchGetProductRelPoiListByIdList
  } from '@/data/repos/medicineMerchantProduct'
  import { REL_POI_MAX_SIZE } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

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
    computed: {
      ...mapModule({
        inputPoiMax: REL_POI_MAX_SIZE
      })
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
