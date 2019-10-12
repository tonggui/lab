<template>
  <div>
    <DynamicForm
      class="product-form"
      ref="form"
      :context="formContext"
      :data="productInfo"
      :config="formConfig"
    />
    <slot name="footer" v-bind="{ isCreate: isCreateMode, confirm: handleConfirm, cancel: handleCancel }">
      <FormFooter
        :is-create="isCreateMode"
        :submitting="submitting"
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

  import SpChangeInfo from '@/views/components/sp-change-info'
  import ChooseProduct from './components/choose-product'
  import CategoryAttrs from './components/category-attrs'
  import CategoryAttrSelect from './components/category-attrs/components/selector'
  import CategoryAttrCascader from './components/category-attrs/components/cascader'
  import CategoryAttrBrand from './components/category-attrs/components/brand'
  import ProductPicture from '@/components/product-picture'
  import ProductVideo from '@/components/product-video'
  import TagList from '@/components/taglist'
  import Brand from '@/components/brand'
  import Origin from './components/origin'
  import Input from './components/Input'
  import ProductAttributes from '@/components/product-attribute/product-attribute-list'
  import ProductLabel from '@/components/product-label'
  import SaleTime from './components/sale-time'
  import CategoryPath from '@/components/category-path'
  import PicDetails from '@/components/pic-details'
  import SellInfo from './components/sell-info'

  import { getInitRules } from '@/data/constants/product'
  import getFormConfig from './config'
  import {
    splitCategoryAttrMap,
    combineCategoryMap
  } from './data'

  import lx from '@/common/lx/lxReport'

  const formConfig = getFormConfig()
  const customComponents = {
    SpChangeInfo,
    FormCard,
    ChooseProduct,
    ProductPicture,
    ProductVideo,
    CategoryAttrs,
    CategoryAttrSelect,
    CategoryAttrCascader,
    CategoryAttrBrand,
    ProductLabel,
    ProductAttributes,
    TagList,
    Brand,
    Origin,
    SaleTime,
    Input,
    CategoryPath,
    PicDetails,
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
      categoryAttrSwitch: {
        type: Boolean,
        defalut: false
      },
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
      submitting: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        productInfo: this.product,
        formConfig,
        normalAttributes: [],
        sellAttributes: []
      }
    },
    computed: {
      isCreateMode () {
        return !this.spuId
      },
      modeString () {
        return this.isCreateMode ? '新建' : '修改'
      },
      whiteList () {
        return getInitRules()
      },
      formContext () {
        return {
          poiId,
          changes: this.changes,
          modeString: this.modeString,
          tagList: this.tagList,
          normalAttributes: this.normalAttributes,
          sellAttributes: this.sellAttributes,
          categoryAttrSwitch: this.categoryAttrSwitch,
          modules: this.modules || {},
          whiteList: this.whiteList
        }
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
          this.normalAttributes = normalAttributes
          this.sellAttributes = sellAttributes
          this.productInfo = {
            ...this.product,
            normalAttributesValueMap,
            sellAttributesValueMap
          }
        }
      }
    },
    methods: {
      async handleConfirm () {
        if (this.$refs.form) {
          let error = null
          try {
            error = await this.$refs.form.validate()
          } catch (err) {
            error = err.message
          }
          if (error) {
            this.$Message.warning(error)
            lx.mc({ bid: 'b_cswqo6ez', val: { fail_reason: error } })
            return
          } else {
            lx.mc({ bid: 'b_cswqo6ez' })
          }
        }
        const {
          categoryAttrList,
          categoryAttrValueMap
        } = combineCategoryMap(this.formContext.normalAttributes, this.formContext.sellAttributes, this.productInfo.normalAttributesValueMap, this.productInfo.sellAttributesValueMap)
        this.$emit('on-confirm', {
          ...this.productInfo,
          categoryAttrList,
          categoryAttrValueMap
        })
      },
      handleCancel () {
        this.$emit('cancel')
      }
    }
  }
</script>

<style lang="less">
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
