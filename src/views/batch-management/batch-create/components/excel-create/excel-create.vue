<template>
  <div class="batch-excel-create" v-if="displayTemplate">
    <OrderFormItem label="下载Excel表格" key="excel">
      <div v-if="isVisible" class="excel-custom-desc">自定义创建仅允许上传非严控品类。</div>
      <RadioGroup
        class="excel-list"
        :options="showExcelList"
        v-model="mode"
        @change="lxMc({ bid: mode.mc })"
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
  import { getPoiId, getIsSingle } from '@/common/constants'
  import { some } from 'lodash'
  import { uuid } from '@utiljs/guid'

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
        submitting: false,
        displayTemplate: false,
        isVisible: false // 是否展示自定义创建
      }
    },
    computed: {
      showExcelList () {
        return this.excelList.filter(excel => {
          // 自建 - allowCustom
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
        const wmPoiId = getIsSingle() ? Number(getPoiId()) : ''
        const excelList = await this.fetchExcelTemplate(wmPoiId)
        /* 存在isVisible为"true"，药品也要展示商超模式的创建（条码 + 自定义） */
        if (some(excelList, ['isVisible', 'true'])) {
          this.isVisible = true
          this.excelList = normalExcel
          this.mode = normalExcel[0]
        }
        this.$nextTick(function () {
          this.displayTemplate = true
          this.excelList = this.excelList.map((item, index) => {
            const temp = excelList[index]
            if (temp) {
              item.link = temp.link
              item.time = temp.time
            }
            return item
          })
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
        if (this.poiIdList.length) {
          lx.mv({
            bid: 'b_shangou_online_e_o2vsr5zg_mv',
            val: {
              poi_num: this.poiIdList.length,
              spu_num: 0
            }
          })
        }
        try {
          const poiIdList = this.isSinglePoi ? [this.$route.query.wmPoiId] : this.poiIdList
          const traceId = uuid()
          const response = await this.submitData(poiIdList, !this.isSinglePoi, this.isUsePicBySp, file, {
            traceId,
            isStandard: this.mode.type === 'standard'
          })
          lx.mc({
            bid: 'b_shangou_online_e_920d7dpf_mc',
            val: {
              select_time: +new Date(response.serverTime),
              trace_id: traceId
            }
          })
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
    .excel-custom-desc{
      margin-bottom: 10px;
    }
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
