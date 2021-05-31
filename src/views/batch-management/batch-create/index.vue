<template>
  <div v-if="havePermission" class="batch-create">
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
          <component :is="productCreateComponent"
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
  <EmptyTip v-else />
</template>
<script>
  import ExcelCreate from './components/excel-create'
  import ProductCreate from './components/product-create'
  import NewProductCreate from './components/new-product-create'
  import Tabs, { TabPane } from '@components/radio-button-tabs'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BATCH_CREATE_USE_SP_IMAGE,
    POI_CUSTOM_PRODUCT,
    BUSINESS_MEDICINE
  } from '@/module/moduleTypes'
  import { forceGetPermission } from '@/views/components/permission-bth/getPermissionMixin'
  import EmptyTip from '../components/empty-tip'

  export default {
    name: 'batch-create-page',
    mixins: [forceGetPermission('CREATE')],
    props: {
      isSinglePoi: Boolean,
      routerTagId: [Number, String],
      gray: Boolean
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
      },
      productCreateComponent () {
        return this.gray ? NewProductCreate : ProductCreate
      }
    },
    components: {
      ExcelCreate,
      ProductCreate,
      Tabs,
      TabPane,
      EmptyTip
    },
    methods: {
      handleSubmit () {
        // if (this.productAuditSwitch) {
        //   this.$Modal.info({
        //     title: '提示',
        //     content: '<div><p>新建成功的商品仍存在“商品图片”等必填字段未填写，必填项欠缺的商品不允许上架售卖。</p><p>请在【任务进度】中查看商品新建进度，待商品新建完成后在商品管理列表中，补充商品信息</p></div>',
        //     okText: '查看任务进度',
        //     iconType: null,
        //     centerLayout: true,
        //     onOk: () => this.jumpToTaskListPage()
        //   })
        // } else {
        //   this.jumpToTaskListPage()
        // }
        this.jumpToTaskListPage()
      },
      jumpToTaskListPage () {
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
