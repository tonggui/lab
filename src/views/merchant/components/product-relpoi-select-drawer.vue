<template>
  <Drawer title="选择门店" :query-poi-list="handleGetPoi" v-bind="$attrs" v-on="$listeners" :support="['search']">
    <template v-slot:search="{ search }">
      <Input placeholder="请输入门店id" v-model="poiId" style="max-width: 160px" />
      <Button type="primary" @click="search">搜索</Button>
    </template>
  </Drawer>
</template>
<script>
  import Drawer from '@/views/components/poi-select/poi-select-drawer'
  import { fetchGetProductRelPoiList } from '@/data/repos/merchantProduct'

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
      Drawer
    },
    methods: {
      handleGetPoi ({ pagination }) {
        return fetchGetProductRelPoiList(this.product.id, pagination, this.poiId)
      }
    }
  }
</script>
