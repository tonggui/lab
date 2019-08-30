<template>
  <div :class="['product-info-image', { 'no-pic': isNoPicture }]" @click="handleClick">
    <img v-lazy="picture" v-if="!isNoPicture" />
    <Icon v-else local="picture" size="22" />
    <span v-if="mark" class="product-info-image-marker bottom-marker" :class="`is-${mark.type}`">{{ mark.name }}</span>
    <span v-if="product.isOTC" class="product-info-image-marker left-marker"></span>
    <span v-if="hasVideo" class="product-info-image-marker right-marker">{{ videoTime | duration }}</span>
  </div>
</template>
<script>
  import createPreview from './modal'
  import {
    PRODUCT_SELL_STATUS,
    PRODUCT_MARK
  } from '@/data/enums/product'
  import {
    ProductMark
  } from '@/data/constants/product'

  export default {
    name: 'product-info-image',
    props: {
      product: {
        type: Object,
        required: true
      },
      editable: Boolean
    },
    computed: {
      picture () {
        return this.product.picture
      },
      isNoPicture () {
        return !this.product.picture
      },
      mark () {
        // 标签展示优先级：风控下架>已下架>已售罄>部分售罄>图片质量差>需补充>待更新
        const {
          isStopSell = false,
          stock,
          sku,
          isNeedCheck = false,
          isNeedFill = false,
          sellStatus
        } = this.product
        let markType // 商品打标
        if (isStopSell) {
          markType = PRODUCT_MARK.RC_SUSPENDED_SALE
        } else if (sellStatus === PRODUCT_SELL_STATUS.OFF) {
          markType = PRODUCT_MARK.SUSPENDED_SALE
        } else if (stock === 0) {
          markType = PRODUCT_MARK.SOLD_OUT
        } else if (sku && sku.some(i => i && i.stock === 0)) {
          markType = PRODUCT_MARK.PART_SOLD_OUT
        } else if (isNeedFill) {
          markType = PRODUCT_MARK.NEED_TO_FILL
        } else if (isNeedCheck) {
          markType = PRODUCT_MARK.NEED_TO_CHECK
        }
        return ProductMark[markType]
      },
      hasVideo () {
        return this.product.video && this.product.video.length > 0
      },
      videoTime () {
        return this.product.video.length
      }
    },
    methods: {
      handleClick () {
        if (this.isNoPicture) {
          this.$Message.warning('此商品暂无图片，请上传～')
          return
        }
        createPreview(this.product.pictureList, this.editable)
      },
      handleVisibleChange (visible) {
        if (!visible) {
          this.currentIndex = 0
        }
      }
    }
  }
</script>
<style lang="less">
.product-info-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  box-sizing: border-box;
  border: 1px solid @border-color-base;
  background: #fff;
  cursor: pointer;
  &.no-pic {
    background-color: @disabled-bg;
  }
  img {
    max-height: 100%;
    max-width: 100%;
    &[lazy=error] {
      background-color: @disabled-bg;
      width: 24px;
    }
  }
  &-marker {
    position: absolute;
    padding: 4px;
    font-size: @font-size-small;
    color: #ffffff;
    text-align: center;
    line-height: 1;
    &.bottom-marker {
      bottom: 0;
      left: 0;
      right: 0;
      &.is-danger {
        background: rgba(244, 113, 107, .9);
      }
      &.is-normal {
        background: rgba(63, 65, 86, .9);
      }
    }
    &.left-marker {
      left: 0;
      top: 0;
      padding: 2px;
      background: #63D29D;
    }
    &.right-marker {
      top: 0;
      right: 0;
      background: rgba(0, 0, 0, .6);
      border-radius: 0 0 0 2px;
    }
  }
}
</style>
