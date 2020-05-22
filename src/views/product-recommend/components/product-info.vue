<template>
  <Layout class="recommend-product-info">
    <ProductInfoImage
      slot="image"
      :product="product"
      class="recommend-product-info-image"
    >
      <template slot="top-left-marker">
        <span class="recommend-product-info-no-sp-marker">非标品</span>
      </template>
    </ProductInfoImage>
    <template slot="info">
      <div slot="name" class="recommend-product-info-name">
        {{product.name}}
      </div>
      <div slot="description" class="recommend-product-info-description">
        <div>{{product.weight}}</div>
        <div>{{product.upc}}</div>
      </div>
    </template>
  </Layout>
</template>
<script>
  import ProductInfoImage from '@/components/product-table-info/product-info-image'
  import Layout from '@/components/product-table-info/layout'

  export default {
    name: 'celluar-missing-product-info',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    components: {
      Layout,
      ProductInfoImage
    },
    methods: {
    }
  }
</script>
<style lang="less">
  .recommend-product-info {
    align-items: flex-start !important;
    width: 100%;
    .product-table-info-layout-img {
      padding-top: 5px;
    }
    .product-table-info-layout-desc {
      padding: 0;
    }
    .boo-tooltip-rel {
      width: 100%;
    }
    &-input-tip {
      display: inline-block;
      margin-top: 8px;
      color: @text-tip-color;
      font-size: @font-size-small;
      line-height: 1em;
    }
    &-no-sp-marker {
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
    &-name {
      font-size: 14px;
      color: #3F4156;
      line-height: 22px;
    }
    &-description {
      font-size: 12px;
      color: #A2A4B3;
      line-height: 22px;
    }
  }
</style>
