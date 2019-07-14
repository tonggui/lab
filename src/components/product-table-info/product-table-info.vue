<template>
  <div class="product-table-info">
    <div class="product-table-info-img">
      <ProductInfoImage :product="product" />
    </div>
    <div class="product-table-info-desc">
      <div>{{ product.name }}</div>
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
    methods: {
      isArray () {
        return isArray
      }
    }
  }
</script>
<style lang="less">
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
    justify-content: space-between;
    padding: 10px 0;
    max-width: calc(100% - 74px);
    > div {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: normal;
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
