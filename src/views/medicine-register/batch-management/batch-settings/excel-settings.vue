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
      <FileUpload @submit="handleSubmit" accept=".xlsx" />
      <FileSelect style="margin-top: 10px" accept=".xlsx" v-model="selectedFile" />
    </OrderFormItem>
    <StickFooter :submitting="submitting" @confirm="handleSubmit" />
  </div>
</template>
<script>
  import OrderFormItem from '@components/order-form-item'
  import ExcelTemplate from '@components/excel-template'
  import { excelList } from './constants'
  import StickFooter from '@/views/batch-management/components/footer'
  import FileSelect from '@components/file-select'
  import { mapStateWatcher } from '@/plugins/router-leave-confirm'

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
        excelList,
        selectedFile: null,
        submitting: false
      }
    },
    watch: {
      ...mapStateWatcher('submitting', {
        pageName: '批量设置',
        content: '上传文件暂未提交成功。离开后，文件将无法保存。确定离开？'
      })
    },
    components: {
      OrderFormItem,
      ExcelTemplate,
      StickFooter,
      FileSelect
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
      async handleSubmit () {
        const file = this.selectedFile
        if (!file) {
          this.$Message.error('请先选择文件！')
          return
        }
        this.submitting = true
        try {
          await this.submitData(file)
          this.$Message.success('批量设置成功～')
          setTimeout(() => {
            this.$emit('submit')
          }, 2000)
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        } finally {
          this.submitting = false
        }
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
