<template>
  <div class="combine-product-edit">
    <Loading v-if="loading" />
    <Form
      v-else
      v-model="product"
      navigation
      ref="form"
      :confirmText="auditBtnText"
      :context="context"
      :is-edit-mode="isEditMode"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>
<script>
  import Form from './form'
  import {
    fetchGetProductDetail
  } from '@/data/repos/product'
  import {
    fetchGetSpInfoById
  } from '@/data/repos/standardProduct'
  import { categoryTemplateMix } from '@/views/category-template'
  import errorHandler from '../edit-page-common/error'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import DefaultMixin from '@/views/edit-page-common/defaultMixin'
  import lx from '@/common/lx/lxReport'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { BUTTON_TEXTS, EDIT_TYPE } from '@/data/enums/common'
  import { poiId } from '@/common/constants'
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
        return EDIT_TYPE.NORMAL
      },
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      auditBtnStatus () {
        if (this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) return 'REVOCATION'
        return this.needAudit ? 'SUBMIT' : !this.spuId ? 'PUBLISH' : 'SAVE'
      },
      auditBtnText () {
        return BUTTON_TEXTS[this.auditBtnStatus]
      },
      // 是否类目推荐
      allowSuggestCategory () {
        return ![
          PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
          PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        ].includes(this.product.auditStatus)
      },
      // 新建场景下是否需要审核
      createNeedAudit () {
        // 新建模式，只判断UPC不存在且选中为指定类目
        return this.categoryNeedAudit && !this.product.upcCode
      },
      // 编辑场景下是否需要审核
      editNeedAudit () {
        if (this.originalProductCategoryNeedAudit) { // 编辑模式下•原始类目需审核，则命中纠错条件则需要审核
          return this.isNeedCorrectionAudit
        } else if (!this.originalProductCategoryNeedAudit && this.categoryNeedAudit) { // 编辑模式下•原始类目无需审核，当前选中为制定类目，需要审核
          return true
        }
        return false
      },
      // 商家是否需要提交审核
      needAudit () {
        const supportAudit = this.supportAudit
        if (!supportAudit) return false
        // 门店未开启审核功能，则不启用审核状态
        if (!this.poiNeedAudit) return false

        if (!this.spuId) {
          return this.createNeedAudit
        } else {
          return this.editNeedAudit
        }
      },
      // 是否为纠错审核
      isNeedCorrectionAudit () {
        if (!this.spuId) return false // 新建场景不可能是纠错
        if (!this.poiNeedAudit) return false // 门店审核状态

        return this.checkCateNeedAudit()
      },
      isEditMode () {
        return this.spuId > 0
      },
      spId () {
        return this.$route.query.spId
      },
      spuId () {
        return +(this.$route.query.spuId || 0)
      },
      context () {
        return {
          felid: {
            [SPU_FIELD.TAG_LIST]: {
              required: !this.usedBusinessTemplate // 从mixin获取
            }
          },
          features: {
            allowCategorySuggest: this.allowSuggestCategory // 根据审核变化
          }
        }
      },
      // TODO 展示upcImage？
      showUpcImage () {
        return false
      },
      // TODO 快捷新建入口
      showShortCut () {
        // 审核场景下如果没有upcCode，需要隐藏快捷入口
        return this.shortCut
      }
    },
    async mounted () {
      try {
        this.loading = true
        if (this.spuId) {
          // 编辑模式获取 商品详情
          await this.getDetail()
          await this.getGetNeedAudit(true)
        } else if (this.spId) {
          await this.getSpDetail()
        }
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      async handleConfirm (callback, context = {}) {
        // TODO validType获取?
        if (context && context.validType) this.validType = context.validType
        const id = this.product.id || 0
        // 点击重新提交审核/重新提交审核
        lx.mc({
          bid: 'b_shangou_online_e_3ebesqok_mc',
          val: { spu_id: id }
        })
        try {
          if (this.auditBtnText === BUTTON_TEXTS.REVOCATION) {
            await this.handleRevocation()
          } else {
            await this.handleSubmitEditProduct()
          }
          // 新建编辑下弹窗
          // this.popConfirmModal()
          // TODO 埋点spChangeInfoDecision
          // op_type 标品更新纠错处理，0表示没有弹窗
          // lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: this.formContext.spChangeInfoDecision || 0, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
        } catch (err) {
          console.log('err', err)
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
          this.product = await fetchGetProductDetail(this.spuId, poiId, false)
          this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async getSpDetail () {
        try {
          const spDetail = await fetchGetSpInfoById(+this.spId)
          const { id, ...rest } = spDetail
          // TODO 和之前逻辑?
          this.product = Object.assign({}, rest, { spId: +this.spId, id: undefined })
          this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      }
    }
  }
</script>
