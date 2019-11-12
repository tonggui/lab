<template>
  <div class="batch-create">
    <div v-if="isSinglePoi">
      <ExcelCreate />
    </div>
    <div v-else>
      <Tabs name="batch-create">
        <TabPane name="product" label="单个商品新建" key="product" tab="batch-create">
          <ProductCreate />
        </TabPane>
        <TabPane name="excel" label="Excel表格新建" key="excel" tab="batch-create">
          <ExcelCreate />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
  import ExcelCreate from './components/excel-create'
  import ProductCreate from './components/product-create'
  import Tabs, { TabPane } from '@components/radio-button-tabs'

  export default {
    name: 'batch-create-page',
    props: {
      isSinglePoi: Boolean
    },
    components: {
      ExcelCreate,
      ProductCreate,
      Tabs,
      TabPane
    }
  }
</script>
<style lang="less" scoped>
  .batch-create {
    background: @component-bg;
  }
</style>
