<template>
  <Layout class="recommend-product-info">
    <ProductInfoImage
      slot="image"
      :product="product" :disabled="product.existInRecycle"
      class="recommend-product-info-image"
    >
      <template slot="top-left-marker" v-if="!product.isSp">
        <span class="recommend-product-info-no-sp-marker">非标品</span>
      </template>
      <template slot="bottom-marker">
        <span v-if="product.existInPoi" class="recommend-product-info-bottom-marker">已存在</span>
        <Tooltip v-else-if="product.existInRecycle" transfer placement="top" :width="320" :offset="6" popper-class="recommend-product-info-restore-tooltip" class="recommend-product-info-restore-tooltip"
                 content="商品在回收站中,点击右侧“从回收站恢复”即可恢复该商品，原有销量也会恢复哦~">
          <span>回收站中可恢复</span>
        </Tooltip>
        <span v-else />
      </template>
    </ProductInfoImage>
    <template slot="info">
      <div slot="name" class="recommend-product-info-name">
        <span v-html="highlight(product.name)"></span>
      </div>
      <div slot="description" class="recommend-product-info-description">
        <div v-for="(item, index) in getSkus" :key="index">
          <span v-html="highlight(item)"></span>
        </div>
        <div v-html="highlight(product.upcCode)"></div>
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
      },
      keyword: {
        type: String,
        default: ''
      }
    },
    components: {
      Layout,
      ProductInfoImage
    },
    computed: {
      getSkus () {
        const skuList = this.product.skuList || []
        return skuList.length ? skuList.map(item => `规格 ${item.specName || '--'} 重量 ${item.weight.value || '--'}${item.weight.unit || ''}`) : []
      }
    },
    methods: {
      highlight (name) {
        if (!name) return
        const op = name.replace(this.keyword, `<span style="color: #F89800">${this.keyword}</span>`)
        return op
      }
    }
  }
</script>
<style lang="less">
  .recommend-product-info {
    align-items: flex-start !important;
    width: 100%;
    white-space: normal;
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
    &-restore-tooltip{
      opacity: 0.8;
      font-size: 12px !important;
      .boo-tooltip-rel {
        display: inline-block;
        position: relative;
        width: 110%;
        margin-left: -5%;
        background: rgba(63,65,86,0.9);
        padding: 2px;
        font-style: normal;
        transform: scale(0.9);
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
