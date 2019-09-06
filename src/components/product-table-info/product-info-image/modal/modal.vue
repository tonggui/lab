<template>
  <Modal
    footer-hide
    title="预览"
    :width="530"
    :value="visible"
    class-name="product-info-image-preview vertical-center-modal"
    @on-cancel="handleClose"
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
      :value="list"
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
      ProductPicture
    },
    methods: {
      handleSelect (src, index) {
        this.currentIndex = index
      },
      handleChange (pictureList) {
        this.list = pictureList
        const main = pictureList[0]
        if (!main) {
          this.$Message.warning('主图不能为空，无法为您自动保存')
          return
        }
        this.$emit('change', pictureList)
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
