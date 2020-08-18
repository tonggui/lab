<template>
  <div class="batch-modify">
    <ExcelModify
      v-bind="propsData"
      @submit="handleSubmit"
    />
  </div>
</template>
<script>
  import ExcelModify from './excel-modify'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BUSINESS_MEDICINE
  } from '@/module/moduleTypes'
  import { fetchGetModifyExcelTemplate, fetchSubmitBatchModifyExcel } from '@/data/repos/merchantPoi'
  import { KEYS } from '@/views/merchant/batch-management/menus'

  export default {
    name: 'MerchantBatchModify',
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
          isBusinessClient: true,
          isMedicine: this.isMedicine,
          fetchExcelTemplate: fetchGetModifyExcelTemplate,
          submitData: this.submitData
        }
      }
    },
    components: {
      ExcelModify
    },
    methods: {
      submitData (poiIdList, multiPoiFlag, excelType, file) {
        return fetchSubmitBatchModifyExcel(poiIdList, file, excelType)
      },
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
        this.$router.push({ name: KEYS.PROGRESS, query: this.$route.query })
      }
    }
  }
</script>
