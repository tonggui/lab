<template>
  <Tabs v-model="tab">
    <TabPane label="区域内热卖" name="hot">
      <SpTable
        hot
        v-onlyone="tab === 'hot'"
        :height="tableHeight"
        :fetch-data="fetchGetHotSpList"
        :fetch-category="fetchGetHotCategory"
        @on-select-product="handleProductSelect"
      />
    </TabPane>
    <TabPane label="全部商品" name="all">
      <SpTable
        v-onlyone="tab === 'all'"
        :height="tableHeight"
        :fetch-data="fetchGetSpList"
        :fetch-category="fetchGetCategoryListByParentId"
        @on-select-product="handleProductSelect"
      />
    </TabPane>
  </Tabs>
</template>

<script>
  import SpTable from './sp-table'
  import onlyone from '@/directives/onlyone'
  import withOnlyone from '@/hoc/withOnlyone'
  import { fetchGetHotSpList, fetchGetSpList } from '@/data/repos/standardProduct'
  import { fetchGetHotCategory, fetchGetCategoryListByParentId } from '@/data/repos/category'

  export default {
    name: 'sp-list',
    components: {
      SpTable: withOnlyone(SpTable)
    },
    directives: { onlyone },
    props: {
      modal: Boolean
    },
    data () {
      return {
        tab: 'hot'
      }
    },
    computed: {
      tableHeight () {
        return this.modal ? 360 : undefined
      }
    },
    methods: {
      fetchGetHotSpList,
      fetchGetSpList,
      fetchGetHotCategory,
      fetchGetCategoryListByParentId,
      handleProductSelect (product) {
        this.$emit('on-select-product', product)
      }
    }
  }
</script>
