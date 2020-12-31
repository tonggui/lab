<template>
  <div class="product-package-form">
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
  import FormCard from '@/views/components/product-form/form-card'
  import FormFooter from '@/views/components/product-form/form-footer'
  import FormItemLayout from '@/views/components/product-form/form-item-layout'

  import ProductPicture from '@/components/product-picture'
  import ProductVideo from '@/components/product-video'
  import PurchaseLimitation from '@/components/purchase-limitation'
  import TagList from '@/components/taglist'
  import ProductName from '@/views/components/product-form/components/product-name'
  import Input from '@/views/components/product-form/components/Input'
  import ProductLabel from '@/components/product-label'
  import SaleTime from '@/views/components/product-form/components/sale-time'
  import CategorySelector from './components/category-selector'
  import CategoryPath from '@/components/category-path'
  import PicDetails from '@/components/pic-details'
  import PackageProductList from './components/package-product-list'
  import FreightTemplate from '@/views/components/product-form/components/freight-template'

  import getFormConfig from './config'

  const formConfig = getFormConfig()
  const customComponents = {
    FormCard,
    ProductPicture,
    ProductVideo,
    ProductLabel,
    TagList,
    SaleTime,
    Input,
    ProductName,
    CategoryPath,
    PicDetails,
    PurchaseLimitation,
    PackageProductList,
    CategorySelector,
    FreightTemplate
  }

  export default {
    name: 'ProductPackageForm',
    components: {
      FormFooter,
      DynamicForm: register({ components: customComponents, FormItemContainer: FormItemLayout })(formConfig)
    },
    props: {
      spuId: [String, Number],
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
      },
      hasFooter: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        productInfo: this.product,
        formConfig,
        formContext: {
          poiId,
          originalFormData: {},
          isCreate: !this.spuId,
          tagList: this.tagList,
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
          this.productInfo = {
            ...this.product
          }
          this.formContext = {
            ...this.formContext
          }
        }
      },
      spuId (v) {
        this.formContext = {
          ...this.formContext,
          isCreate: !v
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
      async validate () {
        if (this.$refs.form) {
          let error = null
          try {
            error = await this.$refs.form.validate()
          } catch (err) {
            error = err.message
          }
          if (error) {
            this.$Message.warning(error)
            throw error
          }
        }
        return true
      },
      async handleConfirm () {
        if (await this.validate()) {
          this.$emit('on-confirm', this.productInfo, {
            ...this.formContext
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
    }
  }
</script>

<style lang="less">
  @label-width: 100px;
  .product-package-form {
    .footer.sticky {
      z-index: 10;
    }
  }

  .product-form {
    .form-item-layout > .content > .boo-input-number,
    .form-item-layout > .content > .boo-input-wrapper,
    .form-item-layout > .content > .boo-select {
      width: 440px;
    }

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

    /deep/ .form-item-layout {
      &.stay-mode {
        > .content {
          margin-left: @label-width;
        }
      }
      &.no-desc {
        > .content {
          margin-left: 0;
        }
      }
      > .label-container .label {
        width: @label-width;
      }
    }
  }
</style>
