<template>
  <div :class="['product-info-image', { 'no-pic': isNoPicture }]" @click="handleClick">
    <img v-lazy="picture" v-if="!isNoPicture" />
    <Icon v-else local="picture" size="22" />
    <span v-if="hasMark" class="product-info-image-marker bottom-marker" :class="`is-${mark.type}`">{{ mark.name }}</span>
    <span v-if="product.isOTC" class="product-info-image-marker left-marker"></span>
    <span v-if="hasVideo" class="product-info-image-marker right-marker">{{ videoTime | duration }}</span>
    <Modal
      footer-hide
      title="预览"
      v-model="showPreview"
      transfer
      class-name="product-info-image-preview-modal"
      @on-visible-change="handleVisibleChange"
    >
      <Carousel class="product-info-image-preview" :value="currentIndex" loop arrow="always">
        <CarouselItem v-for="(pic, index) in pictureList" :key="index">
          <div class="product-info-image-preview-picture">
            <img :src="pic">
          </div>
        </CarouselItem>
      </Carousel>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'product-info-image',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        showPreview: false,
        currentIndex: 0
      }
    },
    computed: {
      pictureList () {
        return (this.product.pictureList || []).filter(pic => pic)
      },
      picture () {
        return this.product.picture
      },
      isNoPicture () {
        return !this.product.picture
      },
      hasMark () {
        const { mark } = this.product
        return mark && mark.name
      },
      mark () {
        return this.product.mark
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
        this.showPreview = true
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
    background-color: @color-gray6;
  }
  img {
    max-height: 100%;
    max-width: 100%;
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
  @preview-width: 500px;
  @preview-height: 400px;
  &-preview-modal {
    .boo-modal {
      width: @preview-width !important;
    }
    .boo-modal-body {
      padding: 20px 0;
    }
  }
  &-preview {
    height: @preview-height;
    width: @preview-width;
    padding-bottom: 20px;
    &-picture {
      width: @preview-width;
      height: @preview-height;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .boo-carousel-list {
      width: 100%;
      height: 100%;
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
