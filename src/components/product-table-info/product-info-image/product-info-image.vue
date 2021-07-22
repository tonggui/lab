<template>
  <div :class="['product-info-image', { 'no-pic': isNoPicture }]" @click="handleClick" v-mc="{ bid: 'b_shangou_online_e_tjnjb1fy_mc' }">
    <img v-lazy="picture" v-if="!isNoPicture" />
    <Icon v-else local="picture" size="22" />
    <span class="product-info-image-marker bottom-marker">
      <slot name="bottom-marker">
        <span v-if="mark" class="marker" :class="`is-${mark.type}`">{{ mark.name }}</span>
      </slot>
    </span>
    <span class="top-left-marker product-info-image-marker">
      <slot name="top-left-marker">
        <span v-if="isPackageProduct" class="otc-marker">组包</span>
        <span v-else-if="product.isOTC" class="otc-marker">OTC</span>
      </slot>
    </span>
    <span class="top-right-marker product-info-image-marker">
      <slot name="top-right-marker">
        <span v-if="hasVideo" class="video-marker">{{ videoTime | duration }}</span>
      </slot>
    </span>
  </div>
</template>
<script>
  import createPreview from './modal'
  import {
    PRODUCT_SELL_STATUS,
    PRODUCT_MARK,
    PRODUCT_AUDIT_STATUS, PRODUCT_TYPE
  } from '@/data/enums/product'
  import {
    ProductMark,
    PRODUCT_INFINITE_STOCK
  } from '@/data/constants/product'

  export default {
    name: 'product-info-image',
    props: {
      product: {
        type: Object,
        required: true
      },
      showMarker: {
        type: Boolean,
        default: true
      },
      markerType: {
        type: String,
        validator (type) {
          return Object.values(PRODUCT_MARK).includes(type)
        }
      },
      editable: Boolean,
      disabled: Boolean,
      hasPermission: {
        type: Boolean,
        default: true
      },
      needPermission: Boolean
    },
    computed: {
      picture () {
        if (this.isNoPicture) {
          return
        }
        return this.product.pictureList[0]
      },
      isNoPicture () {
        return !this.product.pictureList || this.product.pictureList.length <= 0
      },
      mark () {
        if (!this.showMarker) {
          return
        }
        if (this.markerType) {
          return ProductMark[this.markerType]
        }
        // TODO: 新增库存不足
        // 标签展示优先级：审核驳回>审核中>平台下架>风控下架>已下架>已售罄>部分售罄>库存不足>图片质量差>需补充>待更新
        const {
          isPlatformStopSell = false,
          isStopSell = false,
          skuList,
          isNeedCheck = false,
          isNeedFill = false,
          sellStatus,
          isMerchantDelete,
          auditStatus,
          isMissingInfo = false
        } = this.product
        let markType // 商品打标
        if (isMissingInfo) { // 商品信息缺失
          markType = PRODUCT_MARK.MISSING_INFORMATION
        } else if (isMerchantDelete) { // 总部删除
          markType = PRODUCT_MARK.MERCHANT_DELETE
        } else if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REJECTED) { // 审核驳回
          markType = PRODUCT_MARK.AUDIT_REJECTED
        } else if (auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) { // 审核中
          markType = PRODUCT_MARK.AUDITING
        } else if (isPlatformStopSell) { // 平台下架
          markType = PRODUCT_MARK.PLATFORM_SUSPENDED_SALE
        } else if (isStopSell) { // 风控下架
          markType = PRODUCT_MARK.RC_SUSPENDED_SALE
        } else if (sellStatus === PRODUCT_SELL_STATUS.OFF) { // 已下架
          markType = PRODUCT_MARK.SUSPENDED_SALE
        } else if (skuList && !skuList.some(i => i && (i.stock > 0 || i.stock === PRODUCT_INFINITE_STOCK))) { // 已售罄
          markType = PRODUCT_MARK.SOLD_OUT
        } else if (skuList && skuList.some(i => i && i.stock === 0)) { // 部分售罄
          markType = PRODUCT_MARK.PART_SOLD_OUT
        } else if (skuList && skuList.every(i => i && i.stock > 0) && skuList.some(i => i && i.skuMinOrderCount > 1 && i.skuMinOrderCount > i.stock)) { // 库存不足
          // 0<库存<起购（起购>1） 所有都存在库存 有库存少于起购
          markType = PRODUCT_MARK.STOCK_INSUFFICIENT_COUNT
        } else if (isNeedFill) { // 图片质量差
          markType = PRODUCT_MARK.NEED_TO_FILL
        } else if (isNeedCheck) { // 需补充
          markType = PRODUCT_MARK.NEED_TO_CHECK
        }
        return ProductMark[markType]
      },
      hasVideo () {
        return this.product.video && this.product.video.duration > 0
      },
      videoTime () {
        return this.product.video.duration
      },
      isPackageProduct () {
        return this.product.type === PRODUCT_TYPE.PACKAGE
      }
    },
    created () {
      this.$preview = null
    },
    watch: {
      product () {
        this.updatePreview()
      },
      editable () {
        this.updatePreview()
      }
    },
    methods: {
      handleClick () {
        if (this.disabled) {
          return
        }
        if (this.isNoPicture) {
          this.$Message.warning('此商品暂无图片，请上传～')
          return
        }
        this.handlePreview()
      },
      handleChange (value) {
        this.$emit('change', value)
      },
      handleClose () {
        this.$preview = null
      },
      handlePreview () {
        this.$preview = createPreview({
          pictureList: this.product.pictureList,
          video: this.hasVideo ? this.product.video : undefined,
          editable: this.editable,
          needPermission: this.needPermission,
          hasPermission: this.hasPermission
        }, {
          onChange: this.handleChange,
          onClose: this.handleClose
        })
      },
      updatePreview () {
        if (this.$preview && this.$preview.visible) {
          this.handlePreview()
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
    font-size: @font-size-small;
    color: #ffffff;
    text-align: center;
    line-height: 1;
    &.bottom-marker {
      bottom: 0;
      left: 0;
      right: 0;
      .marker {
        display: block;
        padding: 4px;
        &.is-danger {
          background: rgba(244, 113, 107, .9);
        }
        &.is-normal {
          background: rgba(63, 65, 86, .9);
        }
        &.is-normal-mini {
          background: rgba(63, 65, 86, .9);
          white-space: nowrap;
          padding: 1px;
        }
      }
    }
    &.top-left-marker {
      left: 0;
      top: 0;
    }
    &.top-right-marker {
      top: 0;
      right: 0;
    }
    .otc-marker {
      display: inline-block;
      padding: 2px;
      background: #63D29D;
    }
    .video-marker {
      display: inline-block;
      padding: 4px;
      background: rgba(0, 0, 0, .6);
      border-radius: 0 0 0 2px;
    }
  }
}
</style>
