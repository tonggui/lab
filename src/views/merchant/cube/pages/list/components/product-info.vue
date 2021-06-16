<template>
  <Layout class="recommend-product-info" :scope-flag="true">
    <ProductInfoImage
      slot="image"
      :product="product"
      class="recommend-product-info-image"
    >
      <template slot="top-left-marker" v-if="!product.isSp">
        <span class="recommend-product-info-no-sp-marker">非标品</span>
      </template>
      <template slot="bottom-marker">
        <component :is="productTagComponent" />
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
        <QualificationTip lackQuaText="该商品需补充资质方可售卖" lackCateText="该商品需申请对应营业资质方可售卖" :product="product" />
      </div>
      <div class="recommend-product-info-hot-data">
        <template v-if="hotValue.type === 1">推荐指数 <Rate allow-half disabled v-model="starValue" icon="star" class="rate" /></template>
        <div v-else-if="hotValue.type === 0 && labelInfo.value" class="tab-hot"><span class="value">{{labelInfo.value}}</span> {{labelInfo.desc}}</div>
      </div>
    </template>
    <template slot="scope">
<!--      <div class="scope-content">-->
<!--        ssssss-->
<!--      </div>-->
    </template>
  </Layout>
</template>
<script>
  import Vue from 'vue'
  import ProductInfoImage from '@/components/product-table-info/product-info-image'
  import Layout from '@/components/product-table-info/layout'
  import QualificationTip from '@/views/product-recommend/pages/product-recommend-list/components/qualification-tip'
  import { NEW_ARRIVAL_PRODUCT_STATUS_TEXT } from '@/data/constants/product'
  import { get } from 'lodash'
  import { NEW_ARRIVAL_PRODUCT_STATUS } from '@/data/enums/product'

  export default {
    name: 'product-info',
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
      productTagComponent () {
        const { isExist, productStatus, isDelete } = this.product
        let text = ''
        let className = ''
        if (isExist && productStatus) {
          text = NEW_ARRIVAL_PRODUCT_STATUS_TEXT[productStatus]
          className = 'recommend-product-info-bottom-marker'
          if (productStatus === NEW_ARRIVAL_PRODUCT_STATUS.SOLDOUT) className += ' danger'
        } else if (isDelete) {
          text = '已删除'
          className += 'recommend-product-info-bottom-marker delete'
        }
        // 引入的vue版本无法使用这种方式
        // return Vue.component('tag-component', {
        //   template: `<span class="${className}">${text}</span>`
        // })
        return Vue.component('tag-component', {
          render: (h) => {
            return h('span', {
              class: className
            }, text)
          }
        })
      },
      hotValue () {
        return this.product.hotValueInfo || {}
      },
      starValue () {
        return get(this.hotValue, 'star')
      },
      labelInfo () {
        return {
          value: get(this.hotValue, 'dataValue'),
          desc: get(this.hotValue, 'dataDesc')
        }
      },
      getSkus () {
        // TODO 商品信息展示
        const isExist = this.product.isExist
        const skuList = this.product.skuList || []
        const mapFunc = isExist ? item => `月售 ${item.monthSale} 库存 ${item.stock} 价格 ${item.price.value}`
          : item => `规格 ${item.specName || '--'} 重量 ${item.weight.value || '--'}${item.weight.unit || ''}`
        return skuList.length ? skuList.map(mapFunc).slice(0, 1) : []
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
      &.danger {
        background: rgba(244, 113, 107, .9);
      }
      &.normal {
        background: rgba(63, 65, 86, .9);
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
    &-hot-data {
      display: flex;
      align-items: center;
      font-size: 12px;
      .rate {
        font-size: 14px;
        margin-left: 4px;
        .boo-rate-star-chart {
          margin-right: 0;
        }
      }
      .tab-hot {
        .value {
          color: #F46E65;
        }
    }
  }
}
</style>
