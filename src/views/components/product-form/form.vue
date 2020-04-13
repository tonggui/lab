<template>
  <div class="product-edit-form">
    <DynamicForm
      class="product-form"
      ref="form"
      :context="formContext"
      :data="productInfo"
      :config="formConfig"
      @dataChange="handleDataChange"
      @contextChange="handleContextChange"
      @triggerEvent="handleEvent"
    />
    <slot name="footer" v-bind="{ isCreate: isCreateMode, confirm: handleConfirm, cancel: handleCancel }">
      <FormFooter
        v-if="hasFooter"
        :auditBtnText="auditBtnText"
        :is-create="isCreateMode"
        :submitting="submitting"
        :categoryTemplateApplying="categoryTemplateApplying"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      />
    </slot>
  </div>
</template>

<script>
  import { poiId } from '@/common/constants'
  import { cloneDeep, isEqual, noop } from 'lodash'

  import register from '@sgfe/dynamic-form-vue/src/components/dynamic-form'
  import FormCard from './form-card'
  import FormFooter from './form-footer'
  import FormItemLayout from './form-item-layout'
  import withDisabled from '@/hoc/withDisabled'

  import SpChangeInfo from '@/views/components/sp-change-info'
  import SpListModal from '@/views/components/sp-list/sp-list-modal'
  import ChooseProduct from './components/choose-product'
  import CategoryAttrs from './components/category-attrs'
  import CategoryAttrSelect from './components/category-attrs/components/selector'
  import CategoryAttrCascader from './components/category-attrs/components/cascader'
  import CategoryAttrBrand from './components/category-attrs/components/brand'
  import CategoryAttrText from './components/category-attrs/components/text'
  import ProductPicture from '@/components/product-picture'
  import ProductVideo from '@/components/product-video'
  import PurchaseLimitation from '@/components/purchase-limitation'
  import TagList from '@/components/taglist'
  import TagListWithSuggest from '@/components/taglist/tag-list-with-suggest'
  import Brand from '@/components/brand'
  import Origin from './components/origin'
  import ProductName from './components/product-name'
  import Input from './components/Input'
  import ProductAttributes from '@/components/product-attribute/product-attribute-list'
  import ProductLabel from '@/components/product-label'
  import SaleTime from './components/sale-time'
  import CategoryPath from '@/components/category-path'
  import PicDetails from '@/components/pic-details'
  import SpPicDetails from '@/components/sp-pic-details'
  import SellInfo from './components/sell-info'
  import TagInput from '@/components/tag-input'
  import UpcImage from './components/upc-image'

  import getFormConfig from './config'
  import usageHooks from './usageHooks'
  import { fetchGetCategoryAttrList } from '@/data/repos/category'
  import {
    splitCategoryAttrMap,
    combineCategoryMap
  } from './data'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { ATTR_TYPE } from '@/data/enums/category'
  import { EDIT_TYPE } from '@/data/enums/common'

  import lx from '@/common/lx/lxReport'

  const formConfig = getFormConfig()
  const customComponents = {
    WithDisabled: withDisabled(FormItemLayout, { content: '当前字段锁定，如需修改请联系业务经理', placement: 'top', maxWidth: 300 }),
    SpChangeInfo,
    SpListModal,
    FormCard,
    ChooseProduct,
    ProductPicture,
    ProductVideo,
    CategoryAttrs,
    CategoryAttrSelect,
    CategoryAttrCascader,
    CategoryAttrBrand,
    CategoryAttrText,
    ProductLabel,
    ProductAttributes,
    TagList,
    TagListWithSuggest,
    TagInput,
    Brand,
    Origin,
    SaleTime,
    Input,
    ProductName,
    CategoryPath,
    PicDetails,
    SpPicDetails,
    PurchaseLimitation,
    SellInfo,
    UpcImage
  }

  export default {
    name: 'ProductForm',
    components: {
      FormFooter,
      DynamicForm: register({ components: customComponents, FormItemContainer: FormItemLayout, hooks: usageHooks })(formConfig)
    },
    inject: {
      injectProductForm: {
        default: noop
      }
    },
    props: {
      spuId: [String, Number],
      changes: {
        type: Array,
        default: () => ([])
      },
      product: {
        type: Object,
        default: () => ({})
      },
      tagList: Array,
      modules: {
        type: Object,
        default: () => ({})
      },
      suggestNoUpc: {
        type: Boolean,
        default: false
      },
      shortCut: {
        type: Boolean,
        default: true
      },
      submitting: {
        type: Boolean,
        default: false
      },
      categoryTemplateApplying: {
        type: Boolean,
        default: false
      },
      usedBusinessTemplate: {
        type: Boolean,
        default: false
      },
      upcExisted: Boolean,
      hasFooter: {
        type: Boolean,
        default: true
      },
      poiNeedAudit: Boolean,
      categoryNeedAudit: Boolean,
      ignoreSuggestCategoryId: {
        type: [Number, String],
        default: null
      }
    },
    data () {
      return {
        productInfo: this.product,
        formConfig,
        formContext: {
          poiId,
          originalFormData: {},
          ignoreSuggestCategoryId: this.ignoreSuggestCategoryId, // 是否暂不使用推荐类目
          categoryTemplateApplying: this.categoryTemplateApplying, // 分类模板应用中
          usedBusinessTemplate: this.usedBusinessTemplate, // 分类模板是否已应用
          spChangeInfoDecision: 0, // 标品字段更新弹框操作类型，0-没弹框，1-同意替换，2-同意但不替换图片，3-关闭，4-纠错
          suggestNoUpc: this.suggestNoUpc,
          shortCut: this.shortCut,
          changes: this.changes,
          isCreate: !this.spuId,
          tagList: this.tagList,
          normalAttributes: [],
          sellAttributes: [],
          poiNeedAudit: this.poiNeedAudit,
          categoryNeedAudit: this.categoryNeedAudit,
          upcExisted: this.upcExisted,
          needAudit: false,
          isNeedCorrectionAudit: false,
          modules: this.modules || {}
        }
      }
    },
    computed: {
      isCreateMode () {
        return !this.spuId
      },
      /**
       * 审核通过过，必须要审核
       * 纠错审核的前提是审核通过，所以纠错驳回也属于审核通过
       */
      hasBeenAuditApproved () {
        const auditStatus = this.productInfo.auditStatus
        return [
          PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
          PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        ].includes(auditStatus)
      },
      // 是否为纠错审核
      isNeedCorrectionAudit () {
        if (this.isCreateMode) return false // 新建场景不可能是纠错
        // 门店审核状态
        if (!this.formContext.poiNeedAudit) return false
        const auditStatus = this.productInfo.auditStatus
        const editType = this.formContext.modules.editType
        // 审核驳回的场景
        // 在审核详情页面，重新提审后一直都是审核纠错状态
        // 正常编辑场景，需要修改关键字段才会命中为需要审核 & 且纠错状态
        if (editType === EDIT_TYPE.CHECK_AUDIT && auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED) {
          return true
        }
        // 只有审核通过的商品存在纠错的诉求
        if (this.hasBeenAuditApproved) {
          // TODO 判断关键字段有变化
          const newData = this.productInfo
          const oldData = this.formContext.originalFormData
          if (newData.upcCode !== oldData.upcCode) return true
          if ((!newData.category && oldData.category) || (newData.category && !oldData.category) || (newData.category.id !== oldData.category.id)) return true
          let isSpecialAttrEqual = true
          for (let i = 0; i < this.formContext.normalAttributes.length; i++) {
            const attr = this.formContext.normalAttributes[i]
            if (attr.attrType === ATTR_TYPE.SPECIAL) {
              if (!isEqual(newData.normalAttributesValueMap[attr.id], oldData.normalAttributesValueMap[attr.id])) {
                isSpecialAttrEqual = false
                break
              }
            }
          }
          return !isSpecialAttrEqual
        }
        return false
      },
      // 商家是否需要提交审核
      // https://km.sankuai.com/page/265142323#id-10.1%E5%95%86%E5%AE%B6%E7%AB%AF%E5%A2%9E%E5%8A%A0%E5%95%86%E5%93%81%E5%AE%A1%E6%A0%B8%E7%AE%A1%E7%90%86
      needAudit () {
        const supportAudit = this.formContext.modules.supportAudit
        if (!supportAudit) return false
        // 门店未开启审核功能，则不启用审核状态
        if (!this.formContext.poiNeedAudit) return false

        const editType = this.formContext.modules.editType
        const auditStatus = this.productInfo.auditStatus
        // 审核详情查看页面，均需要走审核逻辑（除非是审核中，走撤销逻辑）
        if (editType === EDIT_TYPE.CHECK_AUDIT) {
          // 审核驳回状态下，如果UPC不存在且选中类目为需审核类目，需要审核，其他为可保存
          if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REJECTED) {
            if (!this.formContext.upcExisted && this.formContext.categoryNeedAudit) {
              return true
            } else {
              return false
            }
          }
          return true
        }

        // 商品被审核通过过
        if (this.hasBeenAuditApproved) {
          // 修改了关键信息，则需要审核
          if (this.isNeedCorrectionAudit) {
            return true
          }
        } else if (!this.isCreateMode) { // 编辑模式，商品未被审核通过过
          // 场景4.1 编辑场景下，条码在标品库存在，一定不走审核
          if (this.formContext.upcExisted) return false
          // 场景5：UPC在标品库不存在，类目发生变更，且选中类目需要审核
          if (!this.formContext.upcExisted && this.formContext.categoryNeedAudit) {
            const newData = this.productInfo
            const oldData = this.formContext.originalFormData
            if ((!newData.category && oldData.category) || (newData.category && !oldData.category) || (newData.category.id !== oldData.category.id)) {
              return true
            }
          }
        } else if (this.isCreateMode) {
          // 场景2： 类目需审核，且UPC无条码或者条码在标品库不存在
          if (this.formContext.categoryNeedAudit && !this.formContext.upcExisted) {
            return true
          }
        }
        return false
      },
      // 审核按钮文字
      auditBtnText () {
        const auditStatus = this.productInfo.auditStatus
        const editType = this.formContext.modules.editType
        if (auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) return '撤销审核'
        return this.needAudit ? `${editType === EDIT_TYPE.CHECK_AUDIT ? '重新' : ''}提交审核` : ''
      }
    },
    watch: {
      product: {
        immediate: true,
        handler (product) {
          const { categoryAttrList, categoryAttrValueMap } = product
          const {
            normalAttributes,
            normalAttributesValueMap,
            sellAttributes,
            sellAttributesValueMap
          } = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
          this.productInfo = {
            ...this.product,
            normalAttributesValueMap,
            sellAttributesValueMap
          }
          this.formContext = {
            ...this.formContext,
            originalFormData: cloneDeep(this.productInfo),
            normalAttributes,
            sellAttributes
          }
        }
      },
      ignoreSuggestCategoryId (v) {
        this.formContext = {
          ...this.formContext,
          ignoreSuggestCategoryId: v
        }
      },
      categoryTemplateApplying (v) {
        this.formContext = {
          ...this.formContext,
          categoryTemplateApplying: v
        }
      },
      usedBusinessTemplate (v) {
        this.formContext = {
          ...this.formContext,
          usedBusinessTemplate: v
        }
      },
      spuId (v) {
        this.formContext = {
          ...this.formContext,
          isCreate: !v
        }
      },
      suggestNoUpc (v) {
        this.formContext = {
          ...this.formContext,
          suggestNoUpc: v
        }
      },
      shortCut (v) {
        this.formContext = {
          ...this.formContext,
          shortCut: v
        }
      },
      changes (v) {
        this.formContext = {
          ...this.formContext,
          changes: v
        }
      },
      tagList (v) {
        this.formContext = {
          ...this.formContext,
          tagList: v
        }
      },
      poiNeedAudit (v) {
        this.formContext = {
          ...this.formContext,
          poiNeedAudit: v
        }
      },
      categoryNeedAudit (v) {
        this.formContext = {
          ...this.formContext,
          categoryNeedAudit: v
        }
      },
      upcExisted (v) {
        this.formContext = {
          ...this.formContext,
          upcExisted: v
        }
      },
      needAudit (v) {
        this.formContext = {
          ...this.formContext,
          needAudit: v
        }
      },
      isNeedCorrectionAudit (v) {
        this.formContext = {
          ...this.formContext,
          isNeedCorrectionAudit: v
        }
      },
      modules (v) {
        this.formContext = {
          ...this.formContext,
          modules: v
        }
      }
    },
    methods: {
      checkSuggestCategory () {
        const decision = this.formContext.spChangeInfoDecision
        const id = this.productInfo.id
        const { modules, suggestCategory, ignoreSuggestCategoryId, normalAttributes, sellAttributes } = this.formContext
        const { normalAttributesValueMap, sellAttributesValueMap, category, spId } = this.productInfo
        const {
          categoryAttrList,
          categoryAttrValueMap
        } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
        const suggestCategoryId = (suggestCategory || {}).id
        return new Promise((resolve, reject) => {
          if (modules.allowSuggestCategory && !spId && suggestCategoryId && suggestCategoryId !== category.id && ignoreSuggestCategoryId !== suggestCategoryId) {
            lx.mc({
              bid: 'b_a3y3v6ek',
              val: {
                spu_id: id,
                op_type: decision,
                op_res: 0,
                fail_reason: `前端校验失败：商品类目与推荐类目不符`
              }
            })
            // 类目推荐校验mv，只记录初次
            if (!this.suggestValidateMV) {
              this.suggestValidateMV = true
              lx.mv({
                bid: 'b_shangou_online_e_zyic9lks_mv',
                val: { product_spu_name: this.productInfo.name, tag_id: suggestCategoryId }
              })
            }
            this.$Modal.confirm({
              title: '注意',
              centerLayout: true,
              okText: '使用推荐类目',
              cancelText: '继续保存',
              render () {
                return (
                  <div>
                    <div>系统检测到您的商品可能与已填写的类目不符合，建议使用推荐类目：如您选择“继续保存”，平台将对您的商品进行审核</div>
                    <div>1) 审核通过，则您的商品将可以正常售卖</div>
                    <div class="danger">2) 审核不通过，将降低您门店内的商品曝光</div>
                    <div>审核周期：1-7个工作日，审核期间您可以正常售卖</div>
                  </div>
                )
              },
              onOk: () => {
                lx.mc({ bid: 'b_shangou_online_e_57vvinqj_mc' })
                this.productInfo = {
                  ...this.productInfo,
                  category: {
                    id: suggestCategory.id,
                    idPath: suggestCategory.idPath,
                    name: suggestCategory.name,
                    namePath: suggestCategory.namePath,
                    isLeaf: suggestCategory.isLeaf,
                    level: suggestCategory.level
                  }
                }
                fetchGetCategoryAttrList(suggestCategoryId).then(attrs => {
                  const oldNormalAttributesValueMap = this.productInfo.normalAttributesValueMap
                  const oldSellAttributesValueMap = this.productInfo.sellAttributesValueMap
                  const oldSellAttributes = this.formContext.sellAttributes
                  const {
                    normalAttributes,
                    normalAttributesValueMap,
                    sellAttributes,
                    sellAttributesValueMap
                  } = splitCategoryAttrMap(attrs, { ...oldNormalAttributesValueMap, ...oldSellAttributesValueMap })
                  this.formContext = {
                    ...this.formContext,
                    normalAttributes,
                    sellAttributes
                  }
                  const newProductInfo = {
                    ...this.productInfo,
                    normalAttributesValueMap,
                    sellAttributesValueMap
                  }
                  if (sellAttributes.length > 0 || oldSellAttributes.length > 0) {
                    newProductInfo.skuList = []
                  }
                  this.productInfo = newProductInfo
                })
              },
              onCancel: () => {
                lx.mc({ bid: 'b_shangou_online_e_tuexnuui_mc' })
                this.formContext = {
                  ...this.formContext,
                  ignoreSuggestCategoryId: suggestCategoryId
                }
                resolve({
                  product: {
                    ...this.productInfo,
                    categoryAttrList,
                    categoryAttrValueMap
                  },
                  context: {
                    spChangeInfoDecision: decision,
                    ignoreSuggestCategory: true,
                    suggestCategoryId: suggestCategoryId
                  }
                })
              }
            })
          } else {
            resolve({
              product: {
                ...this.productInfo,
                categoryAttrList,
                categoryAttrValueMap
              },
              context: {
                spChangeInfoDecision: decision,
                ignoreSuggestCategory: !!suggestCategoryId && ignoreSuggestCategoryId === suggestCategoryId,
                suggestCategoryId: suggestCategoryId
              }
            })
          }
        })
      },
      async requestUserConfirm () {
        const id = this.productInfo.id || 0
        if (['重新提交审核', '提交审核'].includes(this.auditBtnText)) {
          // 点击重新提交审核/重新提交审核
          lx.mc({
            bid: 'b_shangou_online_e_3ebesqok_mc',
            val: { spu_id: id }
          })
        }
        if (this.productInfo.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) {
          // 撤销审核的点击
          lx.mc({
            bid: 'b_shangou_online_e_2410gzln_mc',
            val: { spu_id: id }
          })
          return new Promise((resolve, reject) => {
            this.$Modal.confirm({
              title: '撤销商品审核',
              content: `撤销【${this.productInfo.name}】的信息审核。的信息审核。<br><br>注：撤销后，新建的商品会被删除，在售商品可重新提审`,
              centerLayout: true,
              iconType: '',
              width: 412,
              onOk: () => resolve(true),
              onCancel: () => resolve(false)
            })
          })
        }
        return true
      },
      async validateAndCompute () {
        const decision = this.formContext.spChangeInfoDecision
        const id = this.productInfo.id
        const isRecommendTag = (this.productInfo.tagList || []).some(tag => !!tag.isRecommend)
        // 点击保存埋点
        lx.mc({
          bid: 'b_cswqo6ez',
          val: {
            spu_id: id,
            op_type: decision,
            is_rcd_tag: isRecommendTag
          }
        })
        if (this.$refs.form) {
          let error = null
          try {
            error = await this.$refs.form.validate()
          } catch (err) {
            error = err.message
          }
          if (error) {
            this.$Message.warning(error)
            // 保存时前端校验错误时埋点
            lx.mc({
              bid: 'b_a3y3v6ek',
              val: {
                spu_id: id,
                op_type: decision,
                op_res: 0,
                fail_reason: `前端校验失败：${error || ''}`
              }
            })
            throw error
          }
        }
        const result = await this.checkSuggestCategory()
        return result
      },
      async handleConfirm () {
        if (await this.requestUserConfirm()) {
          const { product, context } = await this.validateAndCompute()
          this.$emit('on-confirm', product, {
            ...context,
            needAudit: this.needAudit,
            isNeedCorrectionAudit: this.isNeedCorrectionAudit
          })
        }
      },
      handleCancel () {
        this.$emit('cancel')
      },
      handleDataChange (data) {
        this.productInfo = data
      },
      handleContextChange (context) {
        this.formContext = context
      },
      handleEvent (eventName, ...args) {
        this.$emit(eventName, ...args)
      }
    },
    mounted () {
      if (this.injectProductForm) {
        this.injectProductForm(this)
      }
    },
    beforeDestroy () {
      if (this.injectProductForm) {
        this.injectProductForm(null)
      }
    }
  }
</script>

<style lang="less">
  .product-edit-form {
    .footer.sticky {
      z-index: 10;
    }
  }
  .product-form {
    .boo-input-wrapper, .boo-select {
      width: 440px;

      > input {
        height: 36px;
      }

      &.boo-select-multiple .boo-tag {
        height: 28px;
        line-height: 28px;
        /deep/ i {
          top: 7px;
        }
      }
    }
  }
</style>
