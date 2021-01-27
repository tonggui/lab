<template>
  <div class="batch-modify">
    <ExcelSettings
      v-bind="propsData"
      @submit="handleSubmit"
    />
  </div>
</template>
<script>
  import ExcelSettings from './excel-settings'
  import { fetchGetModifyExcelTemplate, fetchSubmitBatchModifyExcel } from '@/data/repos/merchantPoi'
  import { KEYS } from '@/views/medicine-register/batch-management/menus'

  export default {
    name: 'MerchantBatchModify',
    props: {
      isSinglePoi: Boolean,
      routerTagId: [Number, String]
    },
    computed: {
      propsData () {
        return {
          fetchExcelTemplate: fetchGetModifyExcelTemplate,
          submitData: this.submitData
        }
      }
    },
    components: {
      ExcelSettings
    },
    methods: {
      submitData (file) {
        return fetchSubmitBatchModifyExcel(file)
      },
      handleSubmit () {
        this.jumpToTaskListPage()
      },
      jumpToTaskListPage () {
        this.$router.push({ name: KEYS.MEDICINE_REGISTER_PROGRESS, query: this.$route.query })
      }
    }
  }
</script>
