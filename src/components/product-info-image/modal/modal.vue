<template>
  <Modal
    footer-hide
    title="预览"
    :transfer="false"
    :value="visible"
    class-name="product-info-image-preview-modal"
    @on-visible-change="handleVisibleChange"
  >
    <Carousel class="product-info-image-preview" :value="currentIndex" :loop="isLoop" :arrow="arrowType">
      <CarouselItem v-for="(pic, index) in filterPictureList" :key="index">
        <div class="product-info-image-preview-picture">
          <img :src="pic">
        </div>
      </CarouselItem>
    </Carousel>
  </Modal>
</template>
<script>
  export default {
    name: 'product-info-image-preview',
    props: {
      visible: Boolean,
      pictureList: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        currentIndex: 0
      }
    },
    computed: {
      filterPictureList () {
        return (this.pictureList || []).filter(pic => pic)
      },
      isLoop () {
        return this.filterPictureList.length > 1
      },
      arrowType () {
        return this.isLoop ? 'hover' : 'never'
      }
    },
    methods: {
      handleVisibleChange (visible) {
        if (!visible) {
          this.$emit('close')
          this.currentIndex = 0
        }
      }
    }
  }
</script>
<style lang="less">
  .product-info-image-preview {
    @preview-width: 500px;
    @preview-height: 400px;
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
    &-modal {
      .boo-modal {
        width: @preview-width !important;
      }
      .boo-modal-body {
        padding: 20px 0;
      }
    }
  }
</style>
