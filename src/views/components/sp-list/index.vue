<template>
  <Tabs>
    <TabPane label="区域内热卖" name="hot">
      <SpTable
        hot
        :height="tableHeight"
        :fetch-data="fetchGetHotSpList"
        :fetch-category="fetchGetHotCategory"
        @on-select-product="handleProductSelect"
      />
    </TabPane>
    <TabPane label="全部商品" name="all">
      <SpTable
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
import { fetchGetHotSpList, fetchGetSpList } from '@/data/repos/standardProduct'
import { fetchGetHotCategory, fetchGetCategoryListByParentId } from '@/data/repos/category'

export default {
  name: 'sp-list',
  components: {
    SpTable
  },
  props: {
    modal: Boolean
  },
  computed: {
    tableHeight () {
      return this.modal ? '360px' : undefined
    }
  },
  methods: {
    fetchGetHotSpList,
    fetchGetSpList,
    fetchGetHotCategory,
    fetchGetCategoryListByParentId,
    handleProductSelect (product) {
      this.$emit('on-select-product')
    }
  }
}
</script>

<style scoped>

</style>
