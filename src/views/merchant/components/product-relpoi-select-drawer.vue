<template>
  <PoiSelectDrawer
    title="选择门店"
    :query-poi-list="handleGetPoi"
    :query-all-poi-list="handleQueryAllPoi"
    v-bind="$attrs"
    v-on="$listeners"
    :support="['search']"
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
    fetchGetProductAllRelPoiList
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
      }
    }
  }
</script>
