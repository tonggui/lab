<template>
  <div class="selected-product-container">
    <h2>
      <span>已选{{selectedIdList.length}}个商品</span>
      <a class="empty" @click="handleClearSelect">全部清空</a>
    </h2>
<!--    <ul v-for="item in list" :key="item.id">-->
<!--      <li>-->
<!--        <h3>-->
<!--          {{item.name}}-->
<!--        </h3>-->
<!--        <div v-for="product in item.productList" :key="product.id" class="product-info-delete">-->
<!--          <ProductInfo :product="product" />-->
<!--          <a @click="handleDeSelectProduct(product)">x</a>-->
<!--        </div>-->
<!--      </li>-->
<!--    </ul>-->
  </div>
</template>

<script>
  // import ProductInfo from '../components/product-info'
  import { helper } from '../store'
  const { mapState, mapActions } = helper()

  export default {
    name: 'selected-product',
    data () {
      return {
      }
    },
    computed: {
      ...mapState({
        classifySelectedProducts: 'classifySelectedProducts'
      }),
      selectedIdList () {
        return Object.values(this.classifySelectedProducts).reduce((prev, { productList }) => {
          productList.forEach(({ id }) => prev.push(id))
          return prev
        }, [])
      },
      list () {
        return Object.values(this.classifySelectedProducts)
      }
    },
    methods: {
      ...mapActions({
        handleDeSelect: 'deSelectProduct',
        handleClearSelect: 'clearSelected'
      }),
      handleDeSelectProduct (item) {
        this.handleDeSelect([item])
      }
    },
    components: {
      // ProductInfo
    }
  }
</script>

<style lang="less" scoped>
  .selected-product-container {
    border: 1px solid #EEEEEE;
    border-bottom: none;
    //width: 316px;
    > h2 {
      height: 46px;
      line-height: 46px;
      //background: #F5F6FA;
      border-bottom: none;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #222222;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      .empty {
        color: #999999;
      }
    }
    > ul {
      padding: 16px 16px 0;
      height: calc(100% - 46px);
      overflow: auto;
      li {
        list-style: none;
        margin-bottom: 24px;
        > h3 {
          font-weight: 400;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #666666;
          margin-bottom: 16px;
        }
        .product-info-delete {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
