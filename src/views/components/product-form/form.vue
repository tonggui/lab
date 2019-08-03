<template>
  <div>
    <DynamicForm
      class="product-form"
      ref="form"
      :config="formConfig"
      :context="formContext"
      :data="productInfo"
    />
    <slot name="footer" v-bind="{ isCreate: isCreateMode, confirm: handleConfirm, cancel: handleCancel }">
      <FormFooter
        :is-create="isCreateMode"
        :on-confirm="handleConfirm"
        @cancel="handleCancel"
      />
    </slot>
  </div>
</template>

<script>
  import DynamicForm from '@/components/dynamic-form'
  import { getContext } from '@/components/dynamic-form/context'
  import FormCard from './form-card'
  import FormFooter from './form-footer'
  import FormItemLayout from './form-item-layout'

  import ChooseProduct from './components/choose-product'
  import CategoryAttrs from './components/category-attrs'
  import ProductPicture from '@/components/product-picture'
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
    createInitialProduct,
    splitCategoryAttrMap,
    combineCategoryMap
  } from './data'

  export default {
    name: 'ProductForm',
    components: {
      FormFooter,
      DynamicForm: DynamicForm({
        FormCard,
        ChooseProduct,
        ProductPicture,
        CategoryAttrs,
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
      }, FormItemLayout)
    },
    props: {
      spuId: [String, Number],
      categoryAttrSwitch: {
        type: Boolean,
        defalut: false
      },
      product: {
        type: Object,
        default: () => createInitialProduct()
      },
      tagList: Array,
      preferences: {
        type: Object,
        default: () => ({})
      },
      modules: {
        type: Object,
        default: () => ({})
      },
      onConfirm: Function,
      onCancel: Function,
      onConfirmError: Function
    },
    data () {
      return {
        productInfo: this.product,
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
          if (this.formContext) {
            this.formContext.normalAttributes = normalAttributes
            this.formContext.sellAttributes = sellAttributes
          }
          this.productInfo = {
            ...createInitialProduct(),
            ...this.product,
            normalAttributesValueMap,
            sellAttributesValueMap
          }
        }
      },
      preferences (val) {
        this.formContext.preferences = val || {}
      },
      modules (val) {
        this.formContext.modules = val || {}
      }
    },
    methods: {
      async handleConfirm () {
        this.$emit('confirm')
        if (this.$refs.form) {
          try {
            await this.$refs.form.validate()
          } catch {
            return
          }
        }
        if (this.onConfirm) {
          const product = this.$refs.form.formData
          const {
            categoryAttrList,
            categoryAttrValueMap
          } = combineCategoryMap(this.formContext.normalAttributes, this.formContext.sellAttributes, product.normalAttributesValueMap, product.sellAttributesValueMap)
          try {
            await this.onConfirm({
              ...product,
              categoryAttrList,
              categoryAttrValueMap
            })
            window.history.go(-1) // 返回
          } catch (err) {
            this.handleConfrinError(err)
          }
        }
      },
      handleConfrinError (err) {
        const errorMessage = (err && err.message) || err || '保存失败'
        /* eslint-disable indent */
        switch (err.code) {
        case 1013:
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '条码不合法，请核对是否存在以下几种情况',
            content: `
              <ul>
                <li>录入条码与包装上印制的条码不一致</li>
                <li>商品非正规厂商出产，或三无商品：无中文标明产品名称、生产厂厂名、厂址的国产或合资企业产品</li>
                <li>录入条码为店内编码，非通用条形码</li>
                <li>厂商未将条形码在中国物品编码中心（<a href="http://www.ancc.org.cn/" target="_blank">http://www.ancc.org.cn/</a>）备案</li>
                <li>录入条码不符合国际编码规则（国际编码规则：<a href="http://www.ancc.org.cn/Knowledge/BarcodeArticle.aspx?id=183" target="_blank">http://www.ancc.org.cn/Knowledge/BarcodeArticle.aspx?id=183</a>）
                </li>
              </ul>
            `
          })
          break
        default:
          if (this.onConfirmError) {
            this.onConfirmError(err)
          } else {
            this.$Message.error(errorMessage)
          }
          break
        }
        /* eslint-enable indent */
      },
      async handleCancel () {
        this.$emit('cancel')
        if (this.onCancel) {
          await this.onCancel()
        }
      }
    },
    created () {
      this.formConfig = getFormConfig()
      this.formContext = getContext({
        modeString: this.modeString,
        tagList: this.tagList,
        normalAttributes: this.normalAttributes,
        sellAttributes: this.sellAttributes,
        categoryAttrSwitch: this.categoryAttrSwitch,
        preferences: this.preferences,
        modules: this.modules,
        whiteList: this.whiteList
      })
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
      }
    }
  }
</style>
