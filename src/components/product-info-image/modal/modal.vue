<template>
  <Modal
    footer-hide
    title="预览"
    :width="530"
    :transfer="false"
    :value="visible"
    class-name="product-info-image-preview vertical-center-modal"
    @on-visible-change="handleVisibleChange"
    @on-hidden="handleHidden"
  >
    <div class="product-info-image-preview-content">
      <div class="product-info-image-preview-picture">
        <img :src="currentPicture" />
      </div>
      <div v-if="editable" class="product-info-image-preview-footer" @click="handleUpload">
        {{ text }}
      </div>
    </div>
    <ProductPicture
      ref="productPicture"
      box-class="product-info-image-preview-box"
      size="small"
      :value="pictureList"
      :max="5"
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

  export default {
    name: 'product-info-image-preview',
    props: {
      visible: Boolean,
      pictureList: {
        type: Array,
        required: true
      },
      editable: Boolean
    },
    data () {
      return {
        currentIndex: 0,
        autoCropArea: 1
      }
    },
    computed: {
      tips () {
        return ['主图', '包装', '原材料', '特写', '卖点']
      },
      currentPicture () {
        return this.pictureList[this.currentIndex] || defaultImage
      },
      text () {
        const currentImage = this.pictureList[this.currentIndex]
        return currentImage ? '更换' : '上传图片'
      }
    },
    components: {
      ProductPicture
    },
    methods: {
      handleSelect (src, index) {
        this.currentIndex = index
      },
      handleChange (pictureList) {
        this.$emit('change', pictureList)
      },
      handleUpload () {
        const node = this.$refs.productPicture
        if (node) {
          node.handleUploadClick(this.currentIndex)
        }
      },
      handleVisibleChange (visible) {
        if (!visible) {
          this.$emit('close')
        }
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
      width: 490px;
      height: 440px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      img {
        max-width: 100%;
        height: 100%;
      }
    }
    & .product-info-image-preview-box {
      display: inline-flex;
      flex-direction: column-reverse;
    }
  }
</style>
