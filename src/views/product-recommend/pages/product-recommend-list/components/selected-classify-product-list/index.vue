<template>
  <div class="selected-classify-product-list">
    <h2 class="header">{{title}}</h2>
    <ul class="product-list">
      <li v-for="item in children" :key="item.key">
        <ProductInfo :product="item" />
      </li>
    </ul>
  </div>
</template>

<script>
  import ProductInfo from '../product-info'

  export default {
    name: 'selected-classify-product-list',
    props: {
      title: {
        type: String,
        default: ''
      },
      children: {
        type: Array,
        default: () => []
      }
    },
    components: {
      ProductInfo
    }
  }
</script>

<style lang="less" scoped>
  .selected-classify-product-list {
    list-style: none;
    width: 590px;
    .header {
      height: 42px;
      background: #F7F8FA;
      border: 1px solid #E9EAF2;
      border-top: none;
      font-size: 14px;
      color: #A2A4B3;
      letter-spacing: 0;
      line-height: 42px;
      padding-left: 14px;
      font-family: PingFangSC-Regular;
    }
    .product-list {
      background: #FFFFFF;
      list-style: none;
      > li {
        height: 112px;
        border: 1px solid #E9EAF2;
        border-top: none;
        display: flex;
        padding: 17px;
        align-items: center;
      }
    }
  }
</style>
