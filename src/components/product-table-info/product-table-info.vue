<template>
  <div class="product-table-info">
    <div class="product-table-info-img">
      <ProductInfoImage :product="product" />
    </div>
    <div class="product-table-info-desc">
      <div class="product-table-info-desc-name" :class="{ 'two-line': !hasDisplayInfo }">{{ product.name }}</div>
      <small v-if="product.displayInfo">
        <template v-for="(info, i) in product.displayInfo">
          <span class="" :key="i">
            <template v-if="isArray(info)">
              <span v-for="(desc, index) in info" :key="index">{{ desc }}</span>
            </template>
            <template v-else>{{ info }}</template>
          </span>
        </template>
      </small>
    </div>
  </div>
</template>
<script>
  import { isArray } from 'lodash'
  import ProductInfoImage from '@components/product-info-image'

  export default {
    name: 'product-table-info',
    props: {
      product: {
        type: Object,
        default: () => ({})
      }
    },
    components: {
      ProductInfoImage
    },
    computed: {
      hasDisplayInfo () {
        return this.product.displayInfo
      }
    },
    methods: {
      isArray () {
        return isArray
      }
    }
  }
</script>
<style lang="less">
@import '~@/styles/common.less';

.product-table-info {
  display: flex;
  flex-wrap: nowrap;
  &-img {
    flex-shrink: 0;
    margin-right: 10px;
  }
  &-desc {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 0;
    max-width: calc(100% - 74px);
    &-name {
      width: 100%;
      font-weight: normal;
      margin-bottom: 10px;
      &.two-line {
        .two-line-text-overflow
      }
      @media screen and (min-width: 1110px) {
        max-width: 250px;
      }
      @media screen and (min-width: 1180px) {
        max-width: 300px;
      }
      @media screen and (min-width: 1280px) {
        max-width: 350px;
      }
    }
    small {
      font-size: @font-size-small;
      color: @text-helper-color;
    }
  }
}
</style>
