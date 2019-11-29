<template>
  <div class="medicine-edit-form">
    <Alert class="tips" type="error">请仔细核对标题/规格等是否与价格对应，避免造成损失，如有错误请修改</Alert>
    <DynamicForm
      class="medicine-form"
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
  import CategoryAttrText from './components/category-attrs/components/text'
  import SellStatus from './components/sell-status'
  import ProductPicture from '@/components/product-picture'
  import TagList from '@/components/taglist'
  import Input from './components/Input'
  import CategoryPath from '@/components/category-path'

  import getFormConfig from './medicine-config'
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
    SellStatus,
    CategoryAttrs,
    CategoryAttrSelect,
    CategoryAttrCascader,
    CategoryAttrBrand,
    CategoryAttrText,
    TagList,
    Input,
    CategoryPath
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
      submitting: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        productInfo: this.product,
        formConfig,
        formContext: {
          poiId,
          spChangeInfoDecision: 0, // 标品字段更新弹框操作类型，0-没弹框，1-同意替换，2-同意但不替换图片，3-关闭，4-纠错
          poiType: this.poiType,
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
      spuId (v) {
        this.formContext = {
          ...this.formContext,
          isCreate: !v
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
        // 点击保存埋点
        lx.mc({
          bid: 'b_cswqo6ez',
          val: {
            spu_id: id,
            op_type: decision
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
        const {
          categoryAttrList,
          categoryAttrValueMap
        } = combineCategoryMap(this.formContext.normalAttributes, this.formContext.sellAttributes, this.productInfo.normalAttributesValueMap, this.productInfo.sellAttributesValueMap)
        this.$emit('on-confirm', {
          ...this.productInfo,
          categoryAttrList,
          categoryAttrValueMap
        }, { spChangeInfoDecision: decision })
      },
      handleCancel () {
        this.$emit('cancel')
      }
    }
  }
</script>

<style lang="less">
  .tips {
    margin-bottom: 0;
    color: @error-color;
  }
  .medicine-edit-form {
    .footer.sticky {
      z-index: 10;
    }
  }
  .medicine-form {
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
