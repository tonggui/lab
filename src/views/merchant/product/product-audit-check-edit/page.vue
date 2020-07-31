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
  import errorHandler from '../../edit-page-common/error'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import { BUTTON_TEXTS, EDIT_TYPE } from '@/data/enums/common'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { getAttributes } from '@/views/merchant/edit-page-common/common'
  import { ATTR_TYPE } from '@/data/enums/category'
  import { isEqual } from 'lodash'
  // import { cloneDeep } from 'lodash'

  export default {
    name: 'combine-product-edit',
    props: {
      usedBusinessTemplate: Boolean,
      isBusinessClient: Boolean,
      product: Object,
      spId: Number,
      spuId: Number,
      isEditMode: Boolean,
      originalFormData: Object,
      poiNeedAudit: Boolean, // 门店开启审核状态
      supportAudit: Boolean, // 是否支持审核状态
      categoryNeedAudit: Boolean,
      originalProductCategoryNeedAudit: Boolean
    },
    data () {
      return {
        loading: true,
        productInfo: this.product
      }
    },
    components: { Form },
    watch: {
      product: {
        deep: true,
        immediate: true,
        handler (product) {
          this.productInfo = product || {}
        }
      },
      'productInfo.category' (category) {
        this.$emit('on-category-change', this.productInfo)
      }
    },
    computed: {
      mode () {
        return EDIT_TYPE.AUDITING_MODIFY_AUDIT
      },
      auditBtnText () {
        return BUTTON_TEXTS[this.auditBtnStatus]
      },
      auditBtnStatus () {
        return 'RESUBMIT'
      },
      // 审核修改仅在审核中
      allowSuggestCategory () {
        return ![
          PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
          PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
          PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        ].includes(this.productInfo.auditStatus)
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
            }
          },
          features: {
            allowCategorySuggest: this.allowSuggestCategory // 根据审核变化
          }
        }
      },
      // TODO showShortCut?
      showShortCut () {
        const { id, upcCode } = this.productInfo
        // 审核场景下如果没有upcCode，需要隐藏快捷入口
        return !!(id && upcCode)
      },
      // TODO 展示upcImage
      showUpcImage () {
        return true
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
          if (newData.upcCode !== oldData.upcCode) return true
          if ((!newData.category && oldData.category) ||
            (newData.category && !oldData.category) ||
            (newData.category.id !== oldData.category.id)) return true
          let isSpecialAttrEqual = true

          const { normalAttributes = [], normalAttributesValueMap = {} } = getAttributes(
            newData)
          const { normalAttributesValueMap: oldNormalAttributesValueMap = {} } = getAttributes(
            oldData)
          for (let i = 0; i < normalAttributes.length; i++) {
            const attr = normalAttributes[i]
            if (attr.attrType === ATTR_TYPE.SPECIAL) {
              if (!isEqual(normalAttributesValueMap[attr.id], oldNormalAttributesValueMap[attr.id])) {
                isSpecialAttrEqual = false
                break
              }
            }
          }
          return !isSpecialAttrEqual
        }
        return false
      },
      async handleConfirm (callback = () => {}, context = {}) {
        const wholeContext = {
          ...context,
          ...this.$refs.form.form.getPluginContext()
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
          callback()
        }
        this.$emit('on-submit', this.productInfo, wholeContext, cb)
      },
      handleCancel () {
        this.$emit('on-cancel')
      }
      // async handleConfirm (callback, context) {
      //   if (context && context.validType) this.validType = context.validType
      //   try {
      //     // TODO 调接口
      //     await this.handleSubmitEditProduct()
      //     // TODO 埋点spChangeInfoDecision
      //     this.handleCancel()
      //   } catch (err) {
      //     // TODO 埋点spChangeInfoDecision
      //     // lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: this.formContext.spChangeInfoDecision, op_res: 0, fail_reason: `${err.code}: ${err.message}`, spu_id: this.spuId || 0 } })
      //     // 错误处理
      //     errorHandler(err)({
      //       isBusinessClient: this.isBusinessClient,
      //       confirm: this.handleConfirm
      //     })
      //   } finally {
      //     callback()
      //   }
      // }
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
  }
</script>
