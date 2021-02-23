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
  import {
    registerExcelTemplate as fetchRegisterExcelTemplate,
    registerExcelUpload as fetchRegisterExcelUpload
  } from '@/data/api/medicineRegister'
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
          fetchExcelTemplate: fetchRegisterExcelTemplate,
          submitData: this.submitData
        }
      }
    },
    components: {
      ExcelSettings
    },
    methods: {
      submitData (file) {
        return fetchRegisterExcelUpload({ file })
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
