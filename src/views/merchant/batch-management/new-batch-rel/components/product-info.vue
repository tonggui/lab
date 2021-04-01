<template>
  <Layout class="newBatch-product-info">
    <ProductInfoImage
      slot="image"
      :product="product"
      class="newBatch-product-info-image"
    >
      <template slot="bottom-marker">
        <span />
      </template>
    </ProductInfoImage>
    <template slot="info">
      <div slot="name" class="newBatch-product-info-name" v-html="computedName">
        {{product.name || '--'}}
      </div>
      <div slot="description" class="newBatch-product-info-description">
        <small v-html="upcCode" />
      </div>
    </template>
  </Layout>
</template>
<script>
  import ProductInfoImage from '@/components/product-table-info/product-info-image'
  import Layout from '@/components/product-table-info/layout'
  import { get } from 'lodash'

  export default {
    name: 'new-batch-product-info',
    props: {
      product: {
        type: Object,
        required: true
      },
      searching: {
        type: String,
        required: ''
      }
    },
    components: {
      Layout,
      ProductInfoImage
    },
    computed: {
      upcCode () {
        const upcCode = get(this.product, 'skuList[0].upcCode', '')
        if (!upcCode) return ''
        if (!this.searching) return `条形码 ${upcCode}`
        return `条形码 ${upcCode.replace(this.searching, `<span style="color: #FF6A00">${this.searching}</span>`)}`
      },
      computedName () {
        if (!this.searching) return this.product.name || '--'
        return get(this.product, 'name', '').replace(this.searching, `<span style="color: #FF6A00">${this.searching}</span>`) || '--'
      }
    }
  }
</script>
<style lang="less">
  .newBatch-product-info {
    align-items: flex-start !important;
    width: 100%;
    &-image {
      width: 40px;
      height: 40px;
    }
    .product-table-info-layout-img {
      //padding-top: 5px;
    }
    .product-table-info-layout-desc {
      padding: 0;
    }
    .boo-tooltip-rel {
      width: 100%;
    }
    &-name {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #222222;
    }
    &-description {
      font-family: PingFangSC-Regular;
      font-size: 10px;
      color: #999999;
    }
  }
</style>
