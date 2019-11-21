<template>
  <div class="batch-create">
    <div class="batch-create-single-poi" v-if="isSinglePoi">
      <ExcelCreate
        :router-tag-id="routerTagId"
        :is-single-poi="isSinglePoi"
        :support-use-sp-image="supportUseSpImage"
        :allowCustom="allowCustom"
      />
    </div>
    <div v-else class="batch-create-multi-poi">
      <Tabs name="batch-create">
        <TabPane name="product" label="单个商品新建" key="product" tab="batch-create">
          <ProductCreate
            :router-tag-id="routerTagId"
            :is-single-poi="isSinglePoi"
            :is-business-client="isBusinessClient"
          />
        </TabPane>
        <TabPane name="excel" label="Excel表格新建" key="excel" tab="batch-create">
          <ExcelCreate
            :router-tagId="routerTagId"
            :is-single-poi="isSinglePoi"
            :support-use-sp-image="supportUseSpImage"
          />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
  import ExcelCreate from './components/excel-create'
  import ProductCreate from './components/product-create'
  import Tabs, { TabPane } from '@components/radio-button-tabs'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BATCH_CREATE_USE_SP_IMAGE,
    POI_CUSTOM_PRODUCT
  } from '@/module/moduleTypes'

  export default {
    name: 'batch-create-page',
    props: {
      isSinglePoi: Boolean,
      routerTagId: [Number, String]
    },
    inject: ['appState'],
    computed: {
      ...mapModule({
        supportUseSpImage: BATCH_CREATE_USE_SP_IMAGE,
        allowCustom: POI_CUSTOM_PRODUCT
      }),
      isBusinessClient () {
        return this.appState.isBusinessClient
      }
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
