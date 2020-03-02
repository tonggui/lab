<template>
  <div class="batch-modify">
    <div v-if="isMedicine">
      <ExcelModify v-bind="propsData" @submit="handleSubmit" />
    </div>
    <div v-else>
      <Tabs name="batch-modify">
        <TabPane name="product" label="匹配商品修改" key="product" tab="batch-modify">
          <ProductModify v-bind="propsData" @submit="handleSubmit" />
        </TabPane>
        <TabPane name="excel" label="Excel表格修改" key="excel" tab="batch-modify">
          <ExcelModify v-bind="propsData" @submit="handleSubmit" />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
  import ExcelModify from './components/excel-modify'
  import ProductModify from './components/product-modify'
  import Tabs, { TabPane } from '@components/radio-button-tabs'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BUSINESS_MEDICINE
  } from '@/module/moduleTypes'

  export default {
    name: 'batch-modify-page',
    props: {
      isSinglePoi: Boolean,
      routerTagId: [Number, String]
    },
    inject: ['appState'],
    computed: {
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE
      }),
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      propsData () {
        return {
          routerTagId: this.routerTagId,
          isSinglePoi: this.isSinglePoi,
          isBusinessClient: this.isBusinessClient,
          isMedicine: this.isMedicine
        }
      }
    },
    components: {
      ExcelModify,
      ProductModify,
      Tabs,
      TabPane
    },
    methods: {
      handleSubmit () {
        this.$router.push({ path: '/batchManagement/progress', query: this.$route.query })
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
