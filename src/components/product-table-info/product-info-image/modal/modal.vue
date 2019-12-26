<template>
  <Modal
    footer-hide
    title="预览"
    :value="visible"
    class-name="product-info-image-preview vertical-center-modal"
    @on-cancel="handleClose"
  >
    <div class="product-info-image-preview-content">
      <template v-if="isVideo">
        <VideoPlayer class="product-info-image-preview-video" :src="video.src" :poster="video.poster" ratio="1:1" />
      </template>
      <template v-else>
        <div class="product-info-image-preview-picture">
          <img :src="currentPicture" />
        </div>
        <div v-if="editable" class="product-info-image-preview-footer" @click="handleUpload">
          {{ text }}
        </div>
      </template>
    </div>
    <div class="product-info-image-preview-thumb">
      <PictureBox
        v-if="video"
        :src="video.poster"
        :size="thumbSize"
        tag="视频"
        selectable
        :selected="isVideo"
        @click="handleSelectVideo"
        viewMode
      />
      <ProductPicture
        ref="productPicture"
        box-class="product-info-image-preview-box"
        :size="thumbSize"
        :value="list"
        :max="tips.length"
        :tips="tips"
        :disabled="!editable"
        selectable
        :selected="currentIndex"
        :autoCropArea="autoCropArea"
        @change="handleChange"
        @select="handleSelect"
      />
    </div>
  </Modal>
</template>
<script>
  import defaultImage from '@/assets/empty.jpg'
  import PictureBox from '@components/product-picture/picture-box'
  import ProductPicture from '@components/product-picture'
  import VideoPlayer from '@components/video/video-player'

  export default {
    name: 'product-info-image-preview',
    props: {
      visible: Boolean,
      video: Object,
      pictureList: {
        type: Array,
        required: true
      },
      editable: Boolean
    },
    data () {
      return {
        currentIndex: this.video ? -1 : 0, // 缩略图的index
        autoCropArea: 1,
        list: this.pictureList
      }
    },
    watch: {
      pictureList (list) {
        if (this.list !== list) {
          this.list = list
        }
      },
      visible (visible) {
        if (visible) {
          this.currentIndex = this.video ? -1 : 0
        }
      }
    },
    computed: {
      thumbSize () {
        if (this.video) {
          return 62
        }
        return 80
      },
      isVideo () {
        return this.video && this.currentIndex === -1
      },
      tips () {
        return ['主图', '包装', '原材料', '特写', '卖点']
      },
      currentPicture () {
        return this.list[this.currentIndex] || defaultImage
      },
      text () {
        const currentImage = this.list[this.currentIndex]
        return currentImage ? '更换' : '上传图片'
      }
    },
    components: {
      ProductPicture,
      VideoPlayer,
      PictureBox
    },
    methods: {
      handleSelectVideo () {
        this.currentIndex = -1
      },
      handleSelect (src, index) {
        this.currentIndex = index
      },
      handleChange (pictureList) {
        this.list = pictureList
        const main = this.list[0]
        if (!main) {
          this.$Message.warning('主图不能为空，无法为您自动保存')
          return
        }
        this.$emit('change', this.list)
      },
      handleUpload () {
        const node = this.$refs.productPicture
        if (node) {
          node.handleUploadClick(this.currentIndex)
        }
      },
      handleClose () {
        this.$emit('close')
      }
    }
  }
</script>
<style lang="less">
  @footer-height: 36px;

  .product-info-image-preview {
    &-content {
      display: flex;
      flex-direction: column;
      height: 440px;
    }
    &-footer {
      height: @footer-height;
      padding: 10px;
      font-size: 12px;
      line-height: 16px;
      background: rgba(0,0,0,.45);
      text-align: center;
      color: #FFFFFF;
      letter-spacing: 0;
      cursor: pointer;
    }
    &-picture {
      width: 100%;
      height: calc(100% - @footer-height);
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      img {
        max-width: 100%;
        height: 100%;
      }
    }
    &-thumb {
      display: flex;
      white-space: nowrap;
    }
    &-video {
      height: 100%;
      /deep/ .poster {
        background-size: cover !important;
      }
    }
    & .product-info-image-preview-box {
      display: inline-flex;
      flex-direction: column-reverse;
    }
  }
</style>
