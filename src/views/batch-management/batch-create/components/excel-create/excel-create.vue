<template>
  <div class="batch-excel-create">
    <OrderFormItem label="下载Excel表格" key="excel">
      <RadioGroup
        class="excel-list"
        :options="showExcelList"
        v-model="mode"
      >
        <template #default="{ item, disabled, selected, clickHandler }">
          <ExcelTemplateRadio
            class="excel-template"
            :disabled="disabled"
            :checked="selected"
            @click="clickHandler"
            v-bind="item"
          />
        </template>
      </RadioGroup>
      <div v-if="mode.tip" class="excel-tip">
        <component v-if="isVueComponent(mode.tip)" :is="mode.tip" />
        <div v-else>{{mode.tip}}</div>
      </div>
      <div
        v-if="supportUseSpImage && mode.type === excelTypes.STANDARD"
        style="margin-top: 10px"
      >
        <Checkbox v-model="isUsePicBySp">
          使用商品库图片
          <span class="tip-text">（填写的条形码在商品库中存在时自动使用）</span>
        </Checkbox>
      </div>
    </OrderFormItem>
    <OrderFormItem label="上传Excel表格" key="file">
      <FileUpload @submit="handleSubmit" accept=".cvs,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
    </OrderFormItem>
  </div>
</template>
<script>
  import { fetchGetCreateExcelTemplate } from '@/data/repos/common'
  import { fetchSubmitBatchCreateByExcel } from '@/data/repos/batch'
  import isVueComponent from 'is-vue-component'
  import RadioGroup from '@/components/group/radio-group'
  import ExcelTemplateRadio from '@/components/excel-template/radio'
  import OrderFormItem from '@components/order-form-item'
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
      const optionList = this.isMedicine ? medicineExcel : normalExcel
      return {
        isUsePicBySp: true,
        excelList: optionList,
        mode: optionList[0]
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
      },
      excelTypes () {
        return EXCEL_TYPE
      }
    },
    components: {
      FileUpload,
      RadioGroup,
      ExcelTemplateRadio,
      OrderFormItem
    },
    methods: {
      isVueComponent,
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
      /deep/ .excel-template-radio-item {
        margin-right: 15px;
      }
    }
    .excel-tip {
      color: #333;
      font-size: @font-size-small;
      line-height: 17px;
      margin-top: 20px;
      width: 855px;
    }
    .tip-text {
      color: @text-tip-color;
      font-size: @font-size-small;
    }
  }
</style>
