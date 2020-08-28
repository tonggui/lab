<template>
  <div class="combine-product-edit">
    <Form
      v-model="productInfo"
      navigation
      :confirmText="auditBtnText"
      :context="context"
      :is-edit-mode="isEditMode"
      ref="form"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>
<script>
  import Form from './form'
  import errorHandler from '../edit-page-common/error'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import { BUTTON_TEXTS, EDIT_TYPE } from '@/data/enums/common'
  import { get, isFunction } from 'lodash'
  import lx from '@/common/lx/lxReport'
  // import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { keyAttrsDiff } from '@/views/edit-page-common/common'

  export default {
    name: 'combine-product-edit',
    props: {
      isBusinessClient: Boolean,
      product: {
        type: Object,
        default: () => ({})
      },
      spId: Number,
      spuId: Number,
      isEditMode: Boolean,
      originalFormData: Object,
      poiNeedAudit: Boolean, // 门店开启审核状态
      supportAudit: Boolean, // 是否支持审核状态
      categoryNeedAudit: Boolean,
      originalProductCategoryNeedAudit: Boolean,
      usedBusinessTemplate: Boolean
    },
    components: { Form },
    computed: {
      productInfo: {
        get () {
          return this.product
        },
        set (product) {
          this.$emit('change', product)
        }
      },
      auditBtnText () {
        return BUTTON_TEXTS[this.auditBtnStatus]
      },
      auditBtnStatus () {
        return 'RESUBMIT'
      },
      // 商家是否需要提交审核
      needAudit () {
        const supportAudit = this.supportAudit
        if (!supportAudit) return false
        // 门店未开启审核功能，则不启用审核状态
        if (!this.poiNeedAudit) return false

        // 审核中商品如果是重新修改也需要走审核(此条件只有审核中存在)
        return true
      },
      // 是否为纠错审核
      isNeedCorrectionAudit () {
        if (!this.poiNeedAudit) return false // 门店审核状态
        return this.checkCateNeedAudit()
      },
      context () {
        return {
          field: {
            [SPU_FIELD.TAG_LIST]: {
              required: !this.usedBusinessTemplate
            },
            [SPU_FIELD.UPC_CODE]: {
              visible: !!(this.originalFormData.id && this.originalFormData.upcCode)
            },
            [SPU_FIELD.UPC_IMAGE]: {
              visible: get(this.productInfo, 'skuList[0].upcCode') && !!this.needAudit
            }
          },
          features: {
            showCellularTopSale: true,
            audit: {
              originalProduct: this.originalFormData,
              approveSnapshot: this.productInfo.approveSnapshot,
              needCorrectionAudit: this.isNeedCorrectionAudit,
              snapshot: this.productInfo.snapshot,
              productSource: this.productInfo.productSource
            },
            allowCategorySuggest: this.allowSuggestCategory // 根据审核变化
          }
        }
      }
    },
    methods: {
      checkCateNeedAudit () {
        // 初始状态的类目需要审核，才会出现纠错审核
        if (this.originalProductCategoryNeedAudit) {
          const newData = this.productInfo
          const oldData = this.originalFormData
          return keyAttrsDiff(oldData, newData)
        }
        return false
      },
      async handleConfirm (callback = () => {}, context = {}) {
        // 点击重新提交审核/重新提交审核
        lx.mc({
          bid: 'b_shangou_online_e_3ebesqok_mc',
          val: { spu_id: this.spuId }
        })
        const showLimitSale = get(this.$refs.form.formContext, `field.${SPU_FIELD.LIMIT_SALE}.visible`)
        const wholeContext = {
          ...context,
          editType: EDIT_TYPE.AUDITING_MODIFY_AUDIT,
          isNeedCorrectionAudit: this.isNeedCorrectionAudit,
          needAudit: this.needAudit,
          saveType: 3, // 仅限审核后中修改场景
          showLimitSale,
          ...this.$refs.form.form.getPluginContext()
        }

        const cb = (err) => {
          if (err) {
            lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: 0, op_res: 0, fail_reason: `${err.code}: ${err.message}`, spu_id: this.spuId || 0 } })
            errorHandler(err)({
              isBusinessClient: this.isBusinessClient,
              confirm: this.handleConfirm
            })
          } else {
            this.handleCancel() // 返回
          }
          if (isFunction(callback)) callback()
        }
        this.$emit('on-submit', this.productInfo, wholeContext, cb)
      },
      handleCancel () {
        this.$emit('on-cancel')
      }
    }
  }
</script>
