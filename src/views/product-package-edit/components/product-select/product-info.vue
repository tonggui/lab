<template>
  <Layout class="recommend-product-info">
    <ProductInfoImage
      slot="image"
      :product="product"
      class="recommend-product-info-image"
    >
      <template slot="top-left-marker">
        <span v-if="product.isOTC" class="otc-marker">OTC</span>
        <span v-if="product.isPrescription" class="otc-marker">处方药</span>
      </template>
    </ProductInfoImage>
    <template slot="info">
      <div slot="name" class="recommend-product-info-name">
        {{product.name || '--'}}
      </div>
      <div slot="description" class="recommend-product-info-description">
        规格
        <Select :value="spec" size="small" @on-change="handleSelectSpecChange" style="width: 80px" line>
          <Option
            v-for="item in product.skuList"
            :key="item.id" :value="`${item.specName}`"
            :disabled="item.upcCode ? false : true"
          >
            {{ item.specName }}
          </Option>
        </Select>
        价格 {{ price || '--' }}
        <div>{{`条形码 ${upcCode}`}}</div>
      </div>
    </template>
  </Layout>
</template>
<script>
  import ProductInfoImage from '@/components/product-table-info/product-info-image'
  import Layout from '@/components/product-table-info/layout'
  // import QualificationTip from './qualification-tip'

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
      // QualificationTip
    },
    data () {
      return {
        spec: '',
        price: '',
        upcCode: ''
      }
    },
    mounted () {
      const skuList = this.product.skuList || []
      // 默认展示第一个upcCode不为空的规格
      const defaultSku = skuList.filter(item => item.upcCode)
      const defaultSpec = defaultSku.length ? defaultSku[0].specName : ''
      this.handleSelectSpecChange(defaultSpec)
    },
    methods: {
      handleSelectSpecChange (data) {
        const skuList = this.product.skuList || []
        const skuSelected = skuList.filter(item => item.specName === data)
        let skuSelectedInfo = null
        this.spec = data
        if (skuSelected.length > 0) {
          this.price = skuSelected[0].price && skuSelected[0].price.value ? skuSelected[0].price.value : '--'
          this.upcCode = skuSelected[0].upcCode || '--'
          skuSelectedInfo = {
            id: this.product.id,
            skuSelectedId: skuSelected[0].id
          }
          this.$emit('on-select', skuSelectedInfo)
        }
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
