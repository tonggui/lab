<template>
  <Layout class="quick-edit-product-info">
    <ProductInfoImage
      slot="image"
      :product="product"
      :show-marker="showMarker"
    >
      <template slot="top-left-marker">
        <span v-if="showNoSpMarker && !product.isSp" class="quick-edit-product-info-no-sp-marker">非标品</span>
      </template>
    </ProductInfoImage>
    <template slot="info">
      <ValidateEditProductName placeholder="请输入" v-if="editable" type="textarea" :autosize="{ minRows: 1 }" :value="product.name" @change="handleChangeName" @on-focus="focus = true" @on-blur="focus = false">
        <small v-show="focus" class="quick-edit-product-info-input-tip">{{ inputTip }}</small>
      </ValidateEditProductName>
      <div v-else>{{ product.name }}</div>
      <small v-show="!!description">{{ description }}</small>
    </template>
  </Layout>
</template>
<script>
  import EditProductName from '@/components/product-name/edit-product-name'
  import ProductInfoImage from '@/components/product-table-info/product-info-image'
  import Layout from '@/components/product-table-info/layout'
  import WrapperValidatePoptip from '@/hoc/withValidatePoptip'
  import {
    PRODUCT_NAME_EXAMPLE
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import { TYPE } from '../constants'

  const ValidateEditProductName = WrapperValidatePoptip(EditProductName)

  export default {
    name: 'quick-edit-product-info',
    props: {
      product: {
        type: Object,
        required: true
      },
      editable: Boolean,
      type: String
    },
    data () {
      return {
        error: false,
        name: this.product.name,
        focus: false
      }
    },
    computed: {
      ...mapModule({
        productNameExample: PRODUCT_NAME_EXAMPLE
      }),
      showMarker () {
        return this.type === TYPE.EXIST
      },
      // 只有新商品 展示 标品/非标品标志
      showNoSpMarker () {
        return this.type === TYPE.NEW && !this.product.isSp
      },
      description () {
        /**
         * 已存在商品：月售
         * 新商品：
         * 可编辑：参考格式xxxx
         * 不可编辑：upcCode
        */
        if (this.type === TYPE.EXIST) {
          const monthSale = this.product.monthSale > 9999 ? '9999+' : this.product.monthSale
          return `月售${monthSale || 0}`
        } else if (!this.nameEditable && this.product.upcCode) {
          return `条形码 ${this.product.upcCode}`
        }
        return ''
      },
      inputTip () {
        if (this.editable) {
          const example = this.productNameExample || ''
          return example && `参考格式 ${example}`
        }
        return ''
      }
    },
    components: {
      Layout,
      ProductInfoImage,
      ValidateEditProductName
    },
    methods: {
      handleChangeName (name) {
        this.$emit('change', name, this.product)
      }
    }
  }
</script>
<style lang="less">
  .quick-edit-product-info {
    .product-table-info-layout-desc {
      padding: 0;
    }
    .boo-tooltip-rel {
      width: 100%;
    }
  }
  .quick-edit-product-info-input-tip {
    display: inline-block;
    margin-top: 8px;
    color: @text-tip-color;
    font-size: @font-size-small;
    line-height: 1em;
  }
  .quick-edit-product-info-no-sp-marker {
    background: #FFFFFF;
    display: inline-block;
    border: 1px solid #FF8D62;
    border-radius: 1.5px 0 2px 0;
    color: #FF8D62;
    padding: 4px;
    transform: scale(.8);
    transform-origin: 0 0;
    margin-top: -1px;
    margin-left: -1px;
  }
</style>
