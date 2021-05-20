<template>
  <div v-if="havePermission" class="batch-modify">
    <Alert style="margin: -30px -30px 30px" type="warning">暂不支持批量修改组包商品</Alert>
    <ExcelModify v-if="isSinglePoi || isMedicine" v-bind="propsData" @submit="handleSubmit" />
    <Tabs name="batch-modify" v-else>
      <TabPane name="product" label="匹配商品修改" key="product" tab="batch-modify">
        <ProductModify v-bind="propsData" @submit="handleSubmit" />
      </TabPane>
      <TabPane name="excel" label="Excel表格修改" key="excel" tab="batch-modify">
        <ExcelModify v-bind="propsData" @submit="handleSubmit" />
      </TabPane>
    </Tabs>
  </div>
  <EmptyTip v-else/>
</template>
<script>
  import ExcelModify from './components/excel-modify'
  import ProductModify from './components/product-modify'
  import Tabs, { TabPane } from '@components/radio-button-tabs'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BUSINESS_MEDICINE
  } from '@/module/moduleTypes'
  import { forceGetPermission } from '@/views/components/permission-bth/getPermissionMixin'
  import EmptyTip from '../components/empty-tip'

  export default {
    name: 'batch-modify-page',
    mixins: [forceGetPermission('EDIT')],
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
      TabPane,
      EmptyTip
    },
    methods: {
      handleSubmit () {
        // if (this.productAuditSwitch) {
        //   this.$Modal.info({
        //     title: '提示',
        //     content: '<div><p>批量修改的商品可能存在必填字段未填写，必填项欠缺的商品不允许上架售卖。</p><p>请在【任务进度】中查看商品新建进度，待商品修改完成后在商品管理列表中，补充商品信息</p></div>',
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

</style>
