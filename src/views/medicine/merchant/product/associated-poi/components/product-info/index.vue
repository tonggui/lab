<template>
  <div class="product-info">
    <div class="product-info-content">
      <div :class="imgClass">
        <img v-if="!!picture" :src="picture" alt="关联商品图片" @error="handleImgError">
        <Icon v-else local="picture" size="22" />
      </div>
      <div>
        <p class="name">{{ product.name }}</p>
        <p class="info">
          <span>UPC: <EmptyDefaultShow :value="product.upcCode" /></span>
          &nbsp;&nbsp;
          <span>SKU码/货号：<EmptyDefaultShow :value="product.skuCode" /></span>
        </p>
      </div>
    </div>
    <slot name="extra"></slot>
  </div>
</template>
<script>
  import errorImg from '@/assets/picture-broken.png'

  export default {
    name: 'associated-poi-product-info',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    watch: {
      product (newProduct, oldProduct) {
        if (newProduct.picture !== oldProduct.picture) {
          this.picture = newProduct.picture
        }
      }
    },
    data () {
      return {
        picture: this.product.picture
      }
    },
    computed: {
      imgClass () {
        return [
          'img',
          {
            'no-img': !this.product.picture,
            'is-error': this.product.picture === errorImg
          }
        ]
      }
    },
    methods: {
      handleImgError () {
        this.picture = errorImg
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-info {
    display: flex;
    align-items: center;
    height: 100px;
    padding: 20px;
    background-color: #fff;
    margin-bottom: 10px;
    margin-top: 10px;
    &-content {
      flex: 1;
      min-width: 200px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .img {
        width: 60px;
        height: 60px;
        line-height: 58px;
        margin-right: 20px;
        border: 1px solid @border-color-base;
        border-radius: @border-radius-base;
        text-align: center;
        &.no-img,
        &.is-error {
          background-color: @disabled-bg;
        }
        &.is-error img {
          width: 24px;
        }
        img {
          width: 100%;
        }
      }
      .name {
        font-size: @font-size-base;
        font-weight: bold;
        line-height: 28px;
      }
      .info {
        font-size: @font-size-small;
        color: @text-tip-color;
        line-height: 26px;
      }
    }
  }
</style>
