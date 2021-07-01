<template>
  <Layout class="recommend-product-info" :scope-flag="scopeFlag">
    <ProductInfoImage
      slot="image"
      :product="product"
      class="recommend-product-info-image"
    >
      <template slot="top-left-marker" v-if="!product.isSp">
        <span class="recommend-product-info-no-sp-marker">非标品</span>
      </template>
      <template slot="bottom-marker">
        <span v-if="product.isHqExist" class="recommend-product-info-bottom-marker">总部已创建</span>
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
        <QualificationTip lackQuaText="该商品需补充资质方可售卖" lackCateText="该商品需申请对应营业资质方可售卖" :product="product" />
      </div>
      <div class="recommend-product-info-hot-data" v-if="hotInfoDisabled">
        <template>{{hotSaleTabInfo}}{{hotSaleValue}}</template>
      </div>
    </template>
    <template slot="scope">
      <div class="scope-content">
        {{ scopeDisplay }}
      </div>
    </template>
  </Layout>
</template>
<script>
  import ProductInfoImage from '@/components/product-table-info/product-info-image'
  import Layout from '@/components/product-table-info/layout'
  import QualificationTip from '@/views/product-recommend/pages/product-recommend-list/components/qualification-tip'
  import { getIntersection } from '@/views/merchant/cube/utils'

  export default {
    name: 'product-info',
    props: {
      product: {
        type: Object,
        required: true
      },
      scopeFlag: {
        type: Boolean,
        default: false
      },
      isSelected: {
        type: Boolean,
        default: false
      },
      currentScope: {
        type: Object
      },
      rowScopeList: {
        type: Array
      },
      hotInfoDisabled: {
        type: Boolean,
        default: true
      }
    },
    components: {
      Layout,
      ProductInfoImage,
      QualificationTip
    },
    computed: {
      // hotValue () {
      //   return this.product.hotSaleDetailsMap || {}
      // },
      hotSaleTabInfo () {
        return '近三十天热销'
      },
      hotSaleValue () {
        return 22222
      },
      getSkus () {
        // TODO 商品信息展示
        const isExist = this.product.isExist
        const skuList = this.product.skuList || []
        const mapFunc = isExist ? item => ``
          : item => `规格 ${item.specName || '--'} 重量 ${item.weight.value || '--'}${item.weight.unit || ''}`
        return skuList.length ? skuList.map(mapFunc).slice(0, 1) : []
      },
      getHqExist () {
        const isHqExist = this.product.isHqExist
        return isHqExist
      },
      scopeDisplay () {
        if (!this.isSelected) {
          // 不选中时关联门店显示逻辑
          if (this.product.isHqExist) {
            if (this.currentScope.cityId !== -1) {
              if (this.currentScope.poiId !== -1) {
                // 当前选中范围为某个门店
                let poiName = this.rowScopeList.find(item => item.id === this.currentScope.poiId).name
                let s = this.product.relatedPoiIds.indexOf(this.currentScope.poiId) === -1 ? '已关联' : '未关联'
                return s + `${poiName}`
              } else {
                // 城市
                let intersection = getIntersection(this.product.relatedPoiIds, this.product.totalPoiIds)
                let cityName = this.rowScopeList.find(item => item.cityId === this.currentScope.cityId).cityName
                return `已关联${cityName + intersection.length}个门店/${cityName}共${this.product.totalPoiIds.length}个门店`
              }
            } else {
              // 全国
              return `已关联全国${this.product.relatedPoiIds.length}个门店/全国共${this.product.totalPoiIds.length}个门店`
            }
          } else {
            return ''
          }
        } else {
          // 选中时关联门店显示逻辑
          if (this.currentScope.cityId !== -1) {
            if (this.currentScope.poiId !== -1) {
              // 某个门店
              let poiName = this.rowScopeList.find(item => item.id === this.currentScope.poiId).name
              return `默认关联${poiName}`
            } else {
              // 某个城市
              let cityName = this.rowScopeList.find(item => item.cityId === this.currentScope.cityId).cityName
              return `默认关联${cityName + this.product.totalPoiIds.length}个门店`
            }
          } else {
            return '默认关联全国所有门店'
          }
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
      bottom: 0;
      left: 0;
      right: 0;
      //background: rgba(63, 65, 86, .6);
      font-size: @font-size-small;
      font-weight: 400;
      font-family: PingFangSC-Regular;
      font-size: 10px;
      background: rgba(0,0,0,0.60);
      color: #FFFFFF;
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
      width: 95%;
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
