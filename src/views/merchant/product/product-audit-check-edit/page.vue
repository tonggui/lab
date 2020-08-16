<template>
  <div class="combine-product-edit">
    <PoiSelect v-model="poiIdList" />
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
  import { BUTTON_TEXTS } from '@/data/enums/common'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { get, isFunction } from 'lodash'
  import PoiSelect from '../../components/poi-select'
  import { keyAttrsDiff } from '@/views/merchant/edit-page-common/common'

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
    components: {
      Form,
      PoiSelect
    },
    computed: {
      poiIdList: {
        get () {
          return this.product.poiIds || []
        },
        set (poiIdList) {
          this.$emit('change', { ...this.product, poiIds: poiIdList })
        }
      },
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
            // TODO 审核暂不支持，所以写死，融合的时候去掉
            [SPU_FIELD.SELL_STATUS]: {
              visible: false
            },
            // TODO 审核暂不支持，所以写死，融合的时候去掉
            [SPU_FIELD.PICTURE_LIST]: {
              options: { max: 5 }
            },
            // 商家商品中心，固定不支持，写死
            [SPU_FIELD.PRODUCT_VIDEO]: {
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
            // TODO 审核暂不支持，所以写死，融合的时候去掉
            allowAddSpec: true,
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
          const oldData = this.originalFormData
          const newData = this.productInfo
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

        const cb = (response, err) => {
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
  }
</script>
