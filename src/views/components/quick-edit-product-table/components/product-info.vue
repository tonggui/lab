<template>
  <Layout class="quick-edit-product-info">
    <ProductInfoImage
      slot="image"
      :product="product" :hasPermission="hasPermission"
      :show-marker="showMarker"
      v-bind="bindItem"
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
  import { NEW_ARRIVAL_PRODUCT_STATUS, PRODUCT_MARK } from '@/data/enums/product'

  const ValidateEditProductName = WrapperValidatePoptip(EditProductName)

  export default {
    name: 'quick-edit-product-info',
    props: {
      product: {
        type: Object,
        required: true
      },
      editable: Boolean,
      type: String,
      hasPermission: Boolean
    },
    data () {
      return {
        error: false,
        name: this.product.name,
        focus: false,
        bindItem: {}
        // markerType: ''
      }
    },
    watch: {
      product (val) {
        if (val.isHqExist) {
          this.bindItem = {
            'marker-type': PRODUCT_MARK.MERCHANT_EXIST
          }
        } else if (val.productStatus && Object.values(NEW_ARRIVAL_PRODUCT_STATUS).includes(val.productStatus)) {
          if (val.productStatus === NEW_ARRIVAL_PRODUCT_STATUS.OFFSHELF) {
            this.bindItem = {
              'marker-type': PRODUCT_MARK.SUSPENDED_SALE
            }
            // this.markerType = PRODUCT_MARK.SUSPENDED_SALE
          } else if (val.productStatus === NEW_ARRIVAL_PRODUCT_STATUS.SOLDOUT) {
            // this.markerType = PRODUCT_MARK.SOLD_OUT
            this.bindItem = {
              'marker-type': PRODUCT_MARK.SOLD_OUT
            }
          }
        }
      }
    },
    computed: {
      ...mapModule({
        productNameExample: PRODUCT_NAME_EXAMPLE
      }),
      showMarker () {
        const { isExist, isHqExist } = this.product
        return this.type === TYPE.EXIST || (this.type === TYPE.NEW_ARRIVAL_MIX && isExist) || (this.type === TYPE.MERCHANT_CENTER && isHqExist)
      },
      // 只有新商品 展示 标品/非标品标志
      showNoSpMarker () {
        const { isSp, isExist } = this.product
        return (this.type === TYPE.NEW && !isSp) || (this.type === TYPE.NEW_ARRIVAL_MIX && !isExist && !isSp)
      },
      description () {
        /**
         * 已存在商品：月售
         * 新商品：
         * 可编辑：参考格式xxxx
         * 不可编辑：upcCode
        */
        if ((this.type === TYPE.EXIST) || (this.type === TYPE.NEW_ARRIVAL_MIX && this.product.isExist)) {
          const monthSale = this.product.monthSale > 9999 ? '9999+' : this.product.monthSale
          return `月售${monthSale || 0}`
        } else if (!this.editable && this.product.upcCode) {
          return `条形码 ${this.product.upcCode}`
        }
        return ''
      },
      inputTip () {
        if (this.editable) {
          const example = this.productNameExample || ''
          return example && `参考格式：${example}`
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
  .quick-edit-product-info .edit-product-name .error {
    position: relative;
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
