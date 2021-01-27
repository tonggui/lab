<template>
  <div class="batch-excel-settings">
    <OrderFormItem label="下载Excel表格" key="excel">
      <div class="excel-list">
        <ExcelTemplate class="excel-template" v-for="excel in excelList" v-bind="excel" :key="excel.title" />
      </div>
    </OrderFormItem>
    <OrderFormItem label="填写表格" key="info">
      <div>根据表格中的要求，将要修改的商品信息填写在下载的表格里</div>
    </OrderFormItem>
    <OrderFormItem label="上传Excel表格" key="file">
      <FileUpload @submit="handleSubmit" accept=".cvs,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
    </OrderFormItem>
  </div>
</template>
<script>
  import OrderFormItem from '@components/order-form-item'
  import ExcelTemplate from '@components/excel-template'
  import FileUpload, { UPLOAD_STATUS } from '@components/file-upload'
  import { excelList } from './constants'

  export default {
    name: 'batch-excel-settings',
    props: {
      fetchExcelTemplate: {
        type: Function,
        required: true
      },
      submitData: {
        type: Function,
        required: true
      }
    },
    data () {
      return {
        excelList
      }
    },
    components: {
      OrderFormItem,
      FileUpload,
      ExcelTemplate
    },
    methods: {
      async getExcel () {
        const excelList = await this.fetchExcelTemplate()
        this.excelList = this.excelList.map((item, index) => {
          const temp = excelList[index]
          if (temp) {
            item.link = temp.link
            if (item.extraLink) {
              item.extraLink.link = temp.extraLink
            }
            item.time = temp.time
          }
          return item
        })
      },
      async handleSubmit (file) {
        if (!file) {
          this.$Message.error('请先选择文件！')
          return UPLOAD_STATUS.ERROR
        }
        try {
          await this.submitData(file)
          this.$Message.success('批量设置成功～')
          setTimeout(() => {
            this.$emit('submit')
          }, 2000)
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
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
  .batch-excel-settings {
    .excel-list {
      display: flex;
    }
  }
</style>
