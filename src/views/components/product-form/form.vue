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
  import { AuditTriggerMode, PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
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
      },
      originalProductCategoryNeedAudit: Boolean
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
          modules: this.modules || {},
          // 商品来源，默认为空
          productSource: 0
        }
      }
    },
    computed: {
      isCreateMode () {
        return !this.spuId
      },
      // 新建模式，只判断UPC不存在且选中为指定类目（类目缺失场景下，保持和新建逻辑一致）
      auditCreateMode () {
        return this.isCreateMode || this.productInfo.isMissingInfo
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
        if (this.auditCreateMode) return false // 新建场景不可能是纠错
        if (!this.formContext.poiNeedAudit) return false // 门店审核状态
        const auditStatus = this.productInfo.auditStatus
        const editType = this.formContext.modules.editType
        // 审核详情页面，审核通过走编辑场景的逻辑
        if (editType === EDIT_TYPE.CHECK_AUDIT && auditStatus !== PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          // 审核驳回，只允许重新提审，且提审后一直都是审核纠错状态
          if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED) {
            return true
          }
          return false
        }
        // 初始状态的类目需要审核，才会出现纠错审核
        if (this.originalProductCategoryNeedAudit) {
          const newData = this.productInfo
          const oldData = this.formContext.originalFormData
          if (newData.upcCode !== oldData.upcCode) return true
          if ((!newData.category && oldData.category) || (newData.category && !oldData.category) || (newData.category.id !== oldData.category.id)) return true
          let isSpecialAttrEqual = true
          console.log('123', this.formContext.normalAttributes)
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
      // v2：https://km.sankuai.com/page/293650179#id-%E4%BC%98%E5%8C%962%EF%BC%9A%E9%80%81%E5%AE%A1%E9%80%BB%E8%BE%91%E4%BC%98%E5%8C%96
      needAudit () {
        const supportAudit = this.formContext.modules.supportAudit
        if (!supportAudit) return false
        // 门店未开启审核功能，则不启用审核状态
        if (!this.formContext.poiNeedAudit) return false

        const editType = this.formContext.modules.editType
        const auditStatus = this.productInfo.auditStatus
        // 审核中商品如果是重新修改也需要走审核(此条件只有审核中存在)
        if (editType === EDIT_TYPE.AUDITING_MODIFY_AUDIT) return true
        // 审核详情查看页面，均需要走审核逻辑（除非是审核中，走撤销逻辑）
        if (editType === EDIT_TYPE.CHECK_AUDIT && auditStatus !== PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          // 审核驳回状态下，如果UPC不存在且选中类目为需审核类目，需要审核，其他为可保存
          if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REJECTED) {
            return this.formContext.categoryNeedAudit
          }
          // 审核撤销状态下，必须送审
          if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION) {
            return true
          }
          return this.isNeedCorrectionAudit
        }

        // 新建模式，只判断UPC不存在且选中为指定类目（类目缺失场景下，保持和新建逻辑一致）
        if (this.auditCreateMode) {
          if (this.formContext.categoryNeedAudit && !this.formContext.upcExisted) {
            return true
          }
        } else if (this.originalProductCategoryNeedAudit) { // 原始类目需审核，则命中纠错条件则需要审核
          return this.isNeedCorrectionAudit
        } else if (!this.originalProductCategoryNeedAudit && this.formContext.categoryNeedAudit) { // 原始类目无需审核，当前选中为制定类目，需要审核
          return true
        }

        return false
      },
      // 审核按钮文字
      auditBtnText () {
        const auditStatus = this.productInfo.auditStatus
        const editType = this.formContext.modules.editType
        if (auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) return editType === EDIT_TYPE.AUDITING_MODIFY_AUDIT ? '重新提交审核' : '撤销审核'
        return this.needAudit ? `${editType === EDIT_TYPE.CHECK_AUDIT ? '重新' : ''}提交审核` : ''
      },
      isNeedFormValidate () {
        const auditStatus = this.productInfo.auditStatus
        const editType = this.formContext.modules.editType
        // 审核撤销场景，不需要表单校验
        if (auditStatus === PRODUCT_AUDIT_STATUS.AUDITING && [
          EDIT_TYPE.CHECK_AUDIT,
          EDIT_TYPE.NORMAL // 兜底，防止审核中的商品在列表页出现
        ].includes(editType)) {
          return false
        }
        return true
      }
    },
    watch: {
      'productInfo.spId' (spId) {
        this.$emit('sp-id-change', spId)
      },
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
          console.log('normalAttributes', product, normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap)
          this.productInfo = {
            ...this.product,
            normalAttributesValueMap,
            sellAttributesValueMap
          }
          this.formContext = {
            ...this.formContext,
            originalFormData: cloneDeep(this.productInfo),
            productSource: this.product.productSource || 0,
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
      createModal (resolve, reject) {
        let tip = '注：选择"撤销"后，新建的商品会被删除，在售商品可重新提审'
        switch (this.productInfo.triggerMode) {
        case AuditTriggerMode.CREATE:
          tip = '注：该商品是新建商品，若选择"撤销"会删除商品'
          break
        case AuditTriggerMode.MODIFY:
          tip = '撤销后可重新提交审核'
          break
        default: break
        }
        const $modal = this.$Modal.open({
          title: '撤销商品审核',
          content: `撤销【${this.product.name}】的信息审核。<br><br>${tip}`,
          centerLayout: true,
          iconType: '',
          width: 412,
          closable: true,
          renderFooter: () => (
            <div>
              <Button onClick={async () => {
                try {
                  resolve(true)
                  $modal.destroy()
                } catch (err) {
                  this.$Message.error(err.message)
                  throw err
                }
              }}>撤销</Button>
              <Button type="primary" onClick={() => {
                $modal.destroy()
                this.$router.replace({ name: 'productAuditCheck', query: { ...this.$route.query, spuId: this.product.id, modify: '1' } })
              }}>修改商品</Button>
            </div>
          )
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
          // 如果为审核中编辑时，重新提交审核
          if (this.formContext.modules.editType === EDIT_TYPE.AUDITING_MODIFY_AUDIT) {
            return true
          } else {
            // to-do
            return new Promise((resolve, reject) => {
              this.createModal(resolve, reject)
            })
          }
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
        if (this.isNeedFormValidate && this.$refs.form) {
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
