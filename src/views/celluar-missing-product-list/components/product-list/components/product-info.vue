<template>
  <Layout>
    <ProductInfoImage
      slot="image"
      :product="product"
      show-marker
      :marker-type="markerType"
    >
      <template slot="top-left-marker">
        <span v-if="showMarker" class="celluar-missing-product-info-no-sp-marker">非标品</span>
      </template>
    </ProductInfoImage>
    <template slot="info">
      <ValidateEidtProductName v-if="nameEditable" type="textarea" :autosize="{ minRows: 1 }" :value="product.name" @change="handleChangeName" />
      <div v-else>{{ product.name }}</div>
      <small>{{ description }}</small>
    </template>
  </Layout>
</template>
<script>
  import {
    PRODUCT_SELL_STATUS,
    PRODUCT_MARK
  } from '@/data/enums/product'
  import EditProductName from '@/components/product-name/edit-product-name'
  import ProductInfoImage from '@/components/product-table-info/product-info-image'
  import Layout from '@/components/product-table-info/layout'
  import WrapperValidatePoptip from '@/hoc/withValidatePoptip'

  const ValidateEidtProductName = WrapperValidatePoptip(EditProductName)

  export default {
    name: 'celluar-missing-product-info',
    props: {
      product: {
        type: Object,
        required: true
      },
      nameEditable: Boolean,
      showNoSpMarker: Boolean,
      description: String
    },
    data () {
      return {
        error: false,
        name: this.product.name
      }
    },
    computed: {
      showMarker () {
        return this.showNoSpMarker && !this.product.isSp
      },
      markerType () {
        if (this.product.sellStatus === PRODUCT_SELL_STATUS.OFF) {
          return PRODUCT_MARK.SUSPENDED_SALE
        }
        return ''
      }
    },
    components: {
      Layout,
      ProductInfoImage,
      ValidateEidtProductName
    },
    methods: {
      handleChangeName (name) {
        this.$emit('change', name, this.product)
      }
    }
  }
</script>
<style lang="less">
  .celluar-missing-product-info-no-sp-marker {
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
