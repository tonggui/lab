<template>
  <Tabs>
    <TabPane label="区域内热卖" name="hot">
      <SpTable
        hot
        :fetch="fetchGetHotSpList"
        @on-select-product="handleProductSelect"
      />
    </TabPane>
    <TabPane label="全部商品" name="all">
      <SpTable
        :fetch="fetchGetSpList"
        @on-select-product="handleProductSelect"
      />
    </TabPane>
  </Tabs>
</template>

<script>
import SpTable from './sp-table'
import { fetchGetHotSpList, fetchGetSpList } from '@/data/repos/standardProduct'

export default {
  name: 'sp-list',
  components: {
    SpTable
  },
  methods: {
    fetchGetHotSpList,
    fetchGetSpList,
    handleProductSelect (product) {
      this.$emit('on-select-product')
    }
  }
}
</script>

<style scoped>

</style>
