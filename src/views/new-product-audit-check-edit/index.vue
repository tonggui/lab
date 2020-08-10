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
  // import {
  //   fetchGetAuditProductDetail
  // } from '@/data/repos/product'
  import errorHandler from '../edit-page-common/error'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  // import DefaultMixin from '@/views/edit-page-common/defaultMixin'
  import { BUTTON_TEXTS } from '@/data/enums/common'
  import { get, isFunction } from 'lodash'
  // import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  // import { cloneDeep } from 'lodash'
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
      originalProductCategoryNeedAudit: Boolean
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
      // mode () {
      //   return EDIT_TYPE.AUDITING_MODIFY_AUDIT
      // },
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
              // TODO taglist设置?
              required: !this.usedBusinessTemplate
            },
            [SPU_FIELD.SELL_STATUS]: {
              visible: false
            },
            [SPU_FIELD.UPC_CODE]: {
              visible: !!(this.originalFormData.id && this.originalFormData.upcCode)
            },
            [SPU_FIELD.UPC_IMAGE]: {
              visible: get(this.productInfo, 'skuList[0].upcCode') && !!this.needAudit
            }
          },
          features: {
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
    // async mounted () {
    //   try {
    //     this.loading = true
    //     if (this.spuId) {
    //       await this.getDetail()
    //       await this.getGetNeedAudit(true)
    //     }
    //   } catch (err) {
    //     console.error(err)
    //     this.$Message.error(err.message)
    //   } finally {
    //     this.loading = false
    //   }
    // },
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
        const showLimitSale = get(this.$refs.form.formContext, `field.${SPU_FIELD.LIMIT_SALE}.visible`)
        const wholeContext = {
          ...context,
          isNeedCorrectionAudit: this.isNeedCorrectionAudit,
          needAudit: this.needAudit,
          saveType: 3, // 仅限审核后中修改场景
          ...this.$refs.form.form.getPluginContext(),
          showLimitSale
        }

        const cb = (err) => {
          if (err) {
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
    // async handleConfirm (callback, context) {
    //     if (context && context.validType) this.validType = context.validType
    //     try {
    //       // TODO 调接口
    //       await this.handleSubmitEditProduct()
    //       // TODO 埋点spChangeInfoDecision
    //       this.handleCancel()
    //     } catch (err) {
    //       // TODO 埋点spChangeInfoDecision
    //       // lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: this.formContext.spChangeInfoDecision, op_res: 0, fail_reason: `${err.code}: ${err.message}`, spu_id: this.spuId || 0 } })
    //       // 错误处理
    //       errorHandler(err)({
    //         isBusinessClient: this.isBusinessClient,
    //         confirm: this.handleConfirm
    //       })
    //     } finally {
    //       callback()
    //     }
    //   }
    // async getDetail () {
    //   try {
    //     this.product = await fetchGetAuditProductDetail(this.spuId)
    //     this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
    //   } catch (err) {
    //     console.error(err)
    //     this.$Message.error(err.message)
    //   }
    // }
  }
</script>
