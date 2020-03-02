<template>
  <div class="batch-excel-create">
    <OrderFormItem label="下载Excel表格" key="excel" :index="index + 1">
      <div class="excel-list">
        <ExcelTemplate class="excel-template" v-for="excel in showExcelList" v-bind="excel" :key="excel.title" />
      </div>
    </OrderFormItem>
    <OrderFormItem label="填写表格" key="info" :index="index + 2">
      <div>根据表格中的要求，将要新建的商品信息填写在下载的表格里</div>
    </OrderFormItem>
    <OrderFormItem label="上传Excel表格" key="file" :index="index + 3">
      <Checkbox v-if="supportUseSpImage" v-model="isUsePicBySp">使用商品库图片</Checkbox>
      <FileUpload @submit="handleSubmit" accept=".cvs,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
    </OrderFormItem>
    <AgreementModal mode="view" v-model="modalVisible" @close="modalVisible = false"></AgreementModal>
  </div>
</template>
<script>
  import { fetchGetCreateExcelTemplate } from '@/data/repos/common'
  import { fetchSubmitBatchCreateByExcel } from '@/data/repos/batch'
  import OrderFormItem from '@components/order-form-item'
  import AgreementModal from '@components/agreement-modal'
  import ExcelTemplate from '@components/excel-template'
  import FileUpload, { UPLOAD_STATUS } from '@components/file-upload'
  import { medicineExcel, normalExcel, EXCEL_TYPE } from './constants'

  export default {
    name: 'batch-excel-create',
    props: {
      isSinglePoi: Boolean,
      poiIdList: Array,
      isMedicine: Boolean,
      index: {
        type: Number,
        default: 0
      },
      supportUseSpImage: Boolean,
      allowCustom: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        isUsePicBySp: true,
        modalVisible: false,
        excelList: this.isMedicine ? medicineExcel : normalExcel
      }
    },
    computed: {
      showExcelList () {
        return this.excelList.filter(excel => {
          if (excel.type === EXCEL_TYPE.CUSTOM && !this.allowCustom) {
            return false
          }
          return true
        })
      }
    },
    components: {
      AgreementModal,
      FileUpload,
      ExcelTemplate,
      OrderFormItem
    },
    methods: {
      async getExcel () {
        const excelList = await fetchGetCreateExcelTemplate()
        this.excelList = this.excelList.map((item, index) => {
          const temp = excelList[index]
          item.link = temp.link
          if (item.extraLink) {
            item.extraLink.link = temp.extraLink
            if (index === 0) {
              item.extraLink.onClick = () => { this.modalVisible = true }
            }
          }
          item.time = temp.time
          return item
        })
      },
      async handleSubmit (file) {
        if (!this.isSinglePoi && this.poiIdList.length <= 0) {
          this.$Message.error('请先选择目标门店')
          return UPLOAD_STATUS.PENDING
        }
        if (!file) {
          this.$Message.error('请先选择文件')
          return UPLOAD_STATUS.ERROR
        }
        try {
          const poiIdList = this.isSinglePoi ? [this.$route.query.wmPoiId] : this.poiIdList
          await fetchSubmitBatchCreateByExcel(poiIdList, !this.isSinglePoi, this.isUsePicBySp, file)
          this.$Message.success('批量创建成功')
          setTimeout(() => {
            this.$emit('submit')
          }, 2000)
        } catch (err) {
          console.log(err)
          err.message && this.$Message.error(err.message)
          return UPLOAD_STATUS.ERROR
        }
        return UPLOAD_STATUS.SUCCESS
      }
    },
    mounted () {
      this.getExcel()
    }
  }
</script>
<style lang="less" scoped>
  .batch-excel-create {
    .excel-list {
      display: flex;
      /deep/ .excel-template {
        margin-right: 15px;
      }
    }
  }
</style>
