<template>
  <Layout class="recommend-product-info">
    <ProductInfoImage
      slot="image"
      :product="product"
      class="recommend-product-info-image"
    >
      <template slot="top-left-marker" v-if="!product.isSp">
        <span class="recommend-product-info-no-sp-marker">非标品</span>
      </template>
      <template slot="bottom-marker">
        <span v-if="product.id" class="recommend-product-info-bottom-marker">已存在</span>
        <span v-else-if="product.isDelete" class="recommend-product-info-bottom-marker delete">已删除</span>
        <span v-else />
      </template>
    </ProductInfoImage>
    <template slot="info">
      <div slot="name" class="recommend-product-info-name">
        {{product.name || '--'}}
      </div>
      <div slot="description" class="recommend-product-info-description">
        <div v-for="(item, index) in getSkus" :key="index">
          {{item}}
        </div>
        <div>{{product.isSp ? `条形码 ${product.upcCode || ''}` : '规格、重量创建时可修改'}}</div>
        <QualificationTip :product="product" />
      </div>
    </template>
  </Layout>
</template>
<script>
  import ProductInfoImage from '@/components/product-table-info/product-info-image'
  import Layout from '@/components/product-table-info/layout'
  import QualificationTip from './qualification-tip'

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
      ProductInfoImage,
      QualificationTip
    },
    computed: {
      getSkus () {
        const skuList = this.product.skuList || []
        return skuList.length ? skuList.map(item => `规格 ${item.specName || '--'} 重量 ${item.weight.value || '--'}${item.weight.unit || ''}`) : []
      }
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
    &-bottom-marker {
      position: absolute;
      padding: 4px;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(63, 65, 86, .9);
      font-size: @font-size-small;
      color: #ffffff;
      text-align: center;
      line-height: 1;
      &.delete {
        background: rgba(244, 113, 107, .9);
      }
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
      .lock-tip {
        color: #F46E65;
      }
    }
  }
</style>
