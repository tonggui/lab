<template>
  <div class="product-edit-form">
    <DynamicForm
      class="product-form"
      ref="form"
      :context="formContext"
      :data="productInfo"
      :config="formConfig"
      @triggerEvent="handleEvent"
    />
    <slot name="footer" v-bind="{ isCreate: isCreateMode, confirm: handleConfirm, cancel: handleCancel }">
      <FormFooter
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

  import getFormConfig from './config'
  import { fetchGetCategoryAttrList } from '@/data/repos/category'
  import {
    splitCategoryAttrMap,
    combineCategoryMap
  } from './data'

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
    SellInfo
  }

  export default {
    name: 'ProductForm',
    components: {
      FormFooter,
      DynamicForm: register({ components: customComponents, FormItemContainer: FormItemLayout })(formConfig)
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
          ignoreSuggestCategoryId: this.ignoreSuggestCategoryId, // 是否暂不使用推荐类目
          categoryTemplateApplying: this.categoryTemplateApplying, // 分类模板应用中
          usedBusinessTemplate: this.usedBusinessTemplate, // 分类模板是否已应用
          spChangeInfoDecision: 0, // 标品字段更新弹框操作类型，0-没弹框，1-同意替换，2-同意但不替换图片，3-关闭，4-纠错
          suggestNoUpc: this.suggestNoUpc,
          changes: this.changes,
          isCreate: !this.spuId,
          tagList: this.tagList,
          normalAttributes: [],
          sellAttributes: [],
          modules: this.modules || {}
        }
      }
    },
    computed: {
      isCreateMode () {
        return !this.spuId
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
      modules (v) {
        this.formContext = {
          ...this.formContext,
          modules: v
        }
      }
    },
    methods: {
      async handleConfirm () {
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
            return
          }
        }
        const { modules, suggestCategory, ignoreSuggestCategoryId, normalAttributes, sellAttributes } = this.formContext
        const { normalAttributesValueMap, sellAttributesValueMap, category, spId } = this.productInfo
        const {
          categoryAttrList,
          categoryAttrValueMap
        } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
        const suggestCategoryId = (suggestCategory || {}).id
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
              this.$emit('on-confirm', {
                ...this.productInfo,
                categoryAttrList,
                categoryAttrValueMap
              }, {
                spChangeInfoDecision: decision,
                ignoreSuggestCategory: true,
                suggestCategoryId: suggestCategoryId
              })
            }
          })
        } else {
          this.$emit('on-confirm', {
            ...this.productInfo,
            categoryAttrList,
            categoryAttrValueMap
          }, {
            spChangeInfoDecision: decision,
            ignoreSuggestCategory: !!suggestCategoryId && ignoreSuggestCategoryId === suggestCategoryId,
            suggestCategoryId: suggestCategoryId
          })
        }
      },
      handleCancel () {
        this.$emit('cancel')
      },
      handleEvent (eventName, ...args) {
        this.$emit(eventName, ...args)
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
