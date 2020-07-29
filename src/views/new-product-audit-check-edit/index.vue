<template>
  <div class="combine-product-edit">
    <Loading v-if="loading" />
    <Form
      v-else
      v-model="product"
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
  import {
    fetchGetAuditProductDetail
  } from '@/data/repos/product'
  import { categoryTemplateMix } from '@/views/category-template'
  import errorHandler from '../edit-page-common/error'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import DefaultMixin from '@/views/edit-page-common/defaultMixin'
  import { BUTTON_TEXTS, EDIT_TYPE } from '@/data/enums/common'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { cloneDeep } from 'lodash'

  export default {
    name: 'combine-product-edit',
    data () {
      return {
        loading: true,
        product: {}
      }
    },
    inject: ['appState'],
    components: { Form },
    mixins: [categoryTemplateMix, DefaultMixin],
    computed: {
      mode () {
        return EDIT_TYPE.AUDITING_MODIFY_AUDIT
      },
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      auditBtnText () {
        return BUTTON_TEXTS[this.auditBtnStatus]
      },
      auditBtnStatus () {
        return 'RESUBMIT'
      },
      // TODO showShortCut?
      showShortCut () {
        const { id, upcCode } = this.product
        // 审核场景下如果没有upcCode，需要隐藏快捷入口
        return !!(id && upcCode)
      },
      // TODO 展示upcImage
      showUpcImage () {
        return true
      },
      // TODO 审核修改仅在审核中
      allowSuggestCategory () {
        return ![
          PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
          PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
          PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        ].includes(this.product.auditStatus)
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
      spuId () {
        return this.$route.query.spuId
      },
      isEditMode () {
        return this.spuId > 0
      },
      context () {
        return {
          felid: {
            [SPU_FIELD.TAG_LIST]: {
              // TODO taglist设置?
              required: !this.usedBusinessTemplate
            }
          },
          features: {
            allowCategorySuggest: this.allowSuggestCategory // 根据审核变化
          }
        }
      }
    },
    async mounted () {
      try {
        this.loading = true
        if (this.spuId) {
          await this.getDetail()
          await this.getGetNeedAudit(true)
        }
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      async handleConfirm (callback, context) {
        if (context && context.validType) this.validType = context.validType
        try {
          // TODO 调接口
          await this.handleSubmitEditProduct()
          // TODO 埋点spChangeInfoDecision
          this.handleCancel()
        } catch (err) {
          // TODO 埋点spChangeInfoDecision
          // lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: this.formContext.spChangeInfoDecision, op_res: 0, fail_reason: `${err.code}: ${err.message}`, spu_id: this.spuId || 0 } })
          // 错误处理
          errorHandler(err)({
            isBusinessClient: this.isBusinessClient,
            confirm: this.handleConfirm
          })
        } finally {
          callback()
        }
      },
      handleCancel () {
        this.$tryToNext()
      },
      async getDetail () {
        try {
          this.product = await fetchGetAuditProductDetail(this.spuId)
          this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      }
    }
  }
</script>
