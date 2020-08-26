<template>
  <div class="batch-excel-create">
    <OrderFormItem label="下载Excel表格" key="excel">
      <RadioGroup
        class="excel-list"
        :options="showExcelList"
        v-model="mode"
        @change="lxMc({ bid: item.mc })"
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
        v-if="supportUseSpImage && mode.type === excelTypes.CUSTOM"
        style="margin-top: 10px"
      >
        <Checkbox v-model="isUsePicBySp">
          使用商品库图片
          <span class="highlight-text">（填写的条形码在商品库中存在时自动使用）</span>
        </Checkbox>
      </div>
    </OrderFormItem>
    <OrderFormItem label="上传Excel表格" key="file">
      <div>请下载表格模板，按表格中格式要求填写商品信息。填写后，上传表格。</div>
      <FileSelect
        style="margin-top: 10px"
        accept=".cvs,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        v-model="selectedFile"
      />
    </OrderFormItem>
    <StickFooter
      :submitting="submitting"
      @confirm="handleSubmit"
      :bid="['b_shangou_online_e_tydqz7i3_mc']"
    />
  </div>
</template>
<script>
  import { fetchGetCreateExcelTemplate } from '@/data/repos/common'
  import { fetchSubmitBatchCreateByExcel } from '@/data/repos/batch'
  import isVueComponent from 'is-vue-component'
  import RadioGroup from '@/components/group/radio-group'
  import ExcelTemplateRadio from '@/components/excel-template/radio'
  import OrderFormItem from '@components/order-form-item'
  import StickFooter from '@/views/batch-management/components/footer'
  import FileSelect from '@components/file-select'
  import lx from '@/common/lx/lxReport'
  import { medicineExcel, normalExcel, EXCEL_TYPE } from './constants'
  import { mapStateWatcher } from '@/plugins/router-leave-confirm'

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
      },
      fetchExcelTemplate: {
        type: Function,
        default: fetchGetCreateExcelTemplate
      },
      submitData: {
        type: Function,
        default: fetchSubmitBatchCreateByExcel
      }
    },
    data () {
      const optionList = this.isMedicine ? medicineExcel : normalExcel
      return {
        isUsePicBySp: true,
        excelList: optionList,
        mode: optionList[0],
        selectedFile: null,
        submitting: false
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
      StickFooter,
      FileSelect,
      RadioGroup,
      ExcelTemplateRadio,
      OrderFormItem
    },
    watch: {
      ...mapStateWatcher('submitting', {
        pageName: '批量创建',
        content: '上传文件暂未提交成功。离开后，文件将无法保存。确定离开？'
      })
    },
    methods: {
      isVueComponent,
      lxMc (option) {
        lx.mc(option)
      },
      async getExcel () {
        const excelList = await this.fetchExcelTemplate()
        this.excelList = this.excelList.map((item, index) => {
          const temp = excelList[index]
          if (temp) {
            item.link = temp.link
            item.time = temp.time
          }
          return item
        })
      },
      async handleSubmit () {
        if (!this.isSinglePoi && this.poiIdList.length <= 0) {
          this.$Message.error('请先选择目标门店')
          return
        }
        const file = this.selectedFile
        if (!file) {
          this.$Message.error('请先选择文件')
          return
        }
        this.submitting = true
        try {
          const poiIdList = this.isSinglePoi ? [this.$route.query.wmPoiId] : this.poiIdList
          await this.submitData(poiIdList, !this.isSinglePoi, this.isUsePicBySp, file)
          this.$Message.success('批量创建成功')
          setTimeout(() => {
            this.$emit('submit')
          }, 2000)
        } catch (err) {
          console.log(err)
          err.message && this.$Message.error(err.message)
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
    .highlight-text {
      font-size: @font-size-small;
    }
  }
</style>
