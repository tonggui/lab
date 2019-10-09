<template>
  <Modal
    footer-hide
    title="预览"
    :value="visible"
    class-name="product-info-image-preview vertical-center-modal"
    @on-cancel="handleClose"
    @on-hidden="handleHidden"
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
    <ProductPicture
      class="product-info-image-preview-thumb"
      ref="productPicture"
      box-class="product-info-image-preview-box"
      :size="thumbSize"
      :value="showPictureList"
      :max="showPictureList.length"
      :tips="tips"
      :disabled="!editable"
      selectable
      :selected="currentIndex"
      :autoCropArea="autoCropArea"
      @change="handleChange"
      @select="handleSelect"
    />
  </Modal>
</template>
<script>
  import defaultImage from '@/assets/empty.jpg'
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
        currentIndex: 0, // 缩略图的index
        autoCropArea: 1,
        list: this.pictureList
      }
    },
    watch: {
      pictureList (list) {
        if (this.list !== list) {
          this.list = list
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
        return this.video && this.currentIndex === 0
      },
      pictureIndex () {
        const offset = this.video && this.currentIndex > 0 ? 1 : 0
        return this.currentIndex - offset
      },
      showPictureList () {
        if (this.video) {
          return [this.video.poster, ...this.list]
        }
        return this.list
      },
      tips () {
        const base = ['主图', '包装', '原材料', '特写', '卖点']
        return this.video ? ['视频', ...base] : base
      },
      currentPicture () {
        return this.list[this.pictureIndex] || defaultImage
      },
      text () {
        const currentImage = this.list[this.pictureIndex]
        return currentImage ? '更换' : '上传图片'
      }
    },
    components: {
      ProductPicture,
      VideoPlayer
    },
    methods: {
      handleSelect (src, index) {
        this.currentIndex = index
      },
      handleChange (pictureList) {
        this.list = this.video ? pictureList.slice(1) : pictureList
        const main = pictureList[0]
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
      },
      handleHidden () {
        this.currentIndex = 0
      }
    }
  }
</script>
<style lang="less">
  .product-info-image-preview {
    &-content {
      display: flex;
      flex-direction: column;
      min-width: 490px;
      height: 440px;
    }
    &-footer {
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
      height: 100%;
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
