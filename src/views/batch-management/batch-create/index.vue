<template>
  <div class="batch-create">
    <Alert style="margin: -30px -30px 30px" type="warning">暂不支持批量新建组包商品</Alert>
    <div class="batch-create-single-poi" v-if="isSinglePoi || isMedicine">
      <ExcelCreate
        :router-tag-id="routerTagId"
        :is-single-poi="isSinglePoi"
        :support-use-sp-image="supportUseSpImage"
        :allowCustom="allowCustom"
        :isMedicine="isMedicine"
        :is-business-client="isBusinessClient"
        @submit="handleSubmit"
      />
    </div>
    <div v-else class="batch-create-multi-poi">
      <Tabs name="batch-create">
        <TabPane name="product" label="单个商品新建" key="product" tab="batch-create">
          <ProductCreate
            :router-tag-id="routerTagId"
            :is-single-poi="isSinglePoi"
            :is-business-client="isBusinessClient"
            @submit="handleSubmit"
          />
        </TabPane>
        <TabPane name="excel" label="Excel表格新建" key="excel" tab="batch-create">
          <ExcelCreate
            :router-tag-id="routerTagId"
            :is-single-poi="isSinglePoi"
            :support-use-sp-image="supportUseSpImage"
            :is-business-client="isBusinessClient"
            :isMedicine="isMedicine"
            @submit="handleSubmit"
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
    POI_CUSTOM_PRODUCT,
    BUSINESS_MEDICINE
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
        allowCustom: POI_CUSTOM_PRODUCT,
        isMedicine: BUSINESS_MEDICINE
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
    },
    methods: {
      handleSubmit () {
        this.$router.push({ path: '/batchManagement/progress', query: this.$route.query })
      }
    }
  }
</script>
<style lang="less" scoped>
  .batch-create {
    background: @component-bg;
  }
</style>
