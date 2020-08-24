<template>
  <div class="batch-excel-modify">
    <OrderFormItem label="下载Excel表格" key="excel" :index="index + 1">
      <div class="excel-list">
        <ExcelTemplate class="excel-template" v-for="excel in excelList" v-bind="excel" :key="excel.title" />
      </div>
    </OrderFormItem>
    <OrderFormItem label="填写表格" key="info" :index="index + 2">
      <div>根据表格中的要求，将要修改的商品信息填写在下载的表格里</div>
    </OrderFormItem>
    <OrderFormItem label="上传Excel表格" key="file" :index="index + 3" :description="fileDescription">
      <RadioGroup v-model="excelType" v-if="!isMedicine" @on-change="lxMc({ bid: 'b_ubseh3li' })">
        <Radio :label="BATCH_EXCEL_TYPE.SKU">通过SKU码/货号</Radio>
        <Radio v-if="isSinglePoi" :label="BATCH_EXCEL_TYPE.NUMBER">通过商品编码</Radio>
        <Radio :label="BATCH_EXCEL_TYPE.UPC">通过UPC条码</Radio>
        <Radio :label="BATCH_EXCEL_TYPE.TITLE">通过商品标题</Radio>
      </RadioGroup>
      <FileUpload @submit="handleSubmit" accept=".cvs,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
    </OrderFormItem>
  </div>
</template>
<script>
  import { fetchGetModifyExcelTemplate } from '@/data/repos/common'
  import { fetchSubmitBatchModifyByExcel } from '@/data/repos/batch'
  import OrderFormItem from '@components/order-form-item'
  import ExcelTemplate from '@components/excel-template'
  import FileUpload, { UPLOAD_STATUS } from '@components/file-upload'
  import { BATCH_EXCEL_TYPE } from '@/data/enums/batch'
  import { normalExcel, medicineExcel } from './constants'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'batch-excel-modify',
    props: {
      isSinglePoi: Boolean,
      poiIdList: Array,
      isMedicine: Boolean,
      index: {
        type: Number,
        default: 0
      },
      fetchExcelTemplate: {
        type: Function,
        default: fetchGetModifyExcelTemplate
      },
      submitData: {
        type: Function,
        default: fetchSubmitBatchModifyByExcel
      }
    },
    data () {
      return {
        excelType: this.isMedicine ? BATCH_EXCEL_TYPE.UPC : BATCH_EXCEL_TYPE.SKU,
        excelList: this.isMedicine ? medicineExcel : normalExcel,
        BATCH_EXCEL_TYPE
      }
    },
    computed: {
      fileDescription () {
        return this.isMedicine ? '' : '选择上传方式（请与表格内方式保持一致）'
      }
    },
    components: {
      OrderFormItem,
      FileUpload,
      ExcelTemplate
    },
    methods: {
      lxMc (option) {
        lx.mc(option)
      },
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
        if (!this.isSinglePoi && this.poiIdList.length <= 0) {
          this.$Message.error('请先选择目标门店！')
          return UPLOAD_STATUS.PENDING
        }
        if (!file) {
          this.$Message.error('请先选择文件！')
          return UPLOAD_STATUS.ERROR
        }
        try {
          const poiIdList = this.isSinglePoi ? [this.$route.query.wmPoiId] : this.poiIdList
          await this.submitData(poiIdList, !this.isSinglePoi, this.excelType, file)
          lx.mc({ bid: 'b_shangou_online_e_ghxy1f6f_mc' })
          this.$Message.success('批量修改成功～')
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
  .batch-excel-modify {
    .excel-list {
      display: flex;
    }
  }
</style>
