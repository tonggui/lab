<template>
  <div class="batch-create">
    <ExcelCreate
      :router-tag-id="routerTagId"
      :is-single-poi="isSinglePoi"
      :support-use-sp-image="supportUseSpImage"
      :allowCustom="allowCustom"
      :isMedicine="isMedicine"
      :fetchExcelTemplate="fetchGetCreateExcelTemplate"
      :submitData="submitData"
      isBusinessClient
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
  import ExcelCreate from '@/views/batch-management/batch-create/components/excel-create'
  import { fetchGetCreateExcelTemplate, fetchSubmitBatchCreateExcel } from '@/data/repos/merchantPoi'
  import { mapModule } from '@/module/module-manage/vue'
  import { KEYS } from '@/views/merchant/batch-management/menus'
  import {
    BATCH_CREATE_USE_SP_IMAGE,
    BUSINESS_MEDICINE,
    POI_CUSTOM_PRODUCT
  } from '@/module/moduleTypes'
  export default {
    name: 'MerchantBatchCreate',
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
      })
    },
    components: {
      ExcelCreate
    },
    methods: {
      fetchGetCreateExcelTemplate,
      submitData (poiIdList, isMultiPoi, useSpLibPicture, file) {
        return fetchSubmitBatchCreateExcel(poiIdList, file, useSpLibPicture)
      },
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
        this.$router.push({ name: KEYS.PROGRESS, query: this.$route.query })
      }
    }
  }
</script>

<style scoped lang="less">
  .batch-create {
    background: @component-bg;
  }
</style>
