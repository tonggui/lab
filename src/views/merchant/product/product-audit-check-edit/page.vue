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
  import errorHandler from '../../edit-page-common/error'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import { BUTTON_TEXTS, EDIT_TYPE } from '@/data/enums/common'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { getAttributes } from '@/views/merchant/edit-page-common/common'
  import { ATTR_TYPE } from '@/data/enums/category'
  import { isEqual } from 'lodash'

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
            },
            [SPU_FIELD.UPC_CODE]: {
              visible: !!(this.productInfo.id && this.productInfo.upcCode)
            },
            [SPU_FIELD.UPC_IMAGE]: {
              visible: !!this.needAudit
            }
          },
          features: {
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
    }
  }
</script>
