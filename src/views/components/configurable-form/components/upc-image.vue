<template>
  <div class="upc-image">
    <ProductPicture
      :value="[value || '']"
      :max="1"
      :tips="[]"
      :tags="[]"
      :disabled="disabled"
      preview
      @change="handleImageChange"
    />
    <div class="example-container">
      <div class="arrow"></div>
      <ProductPicture
        class="example"
        :value="[exampleImg]"
        :max="1"
        :tips="[]"
        :tags="['示例']"
        tag-placement="top-left"
        disabled
        preview
      />
    </div>
  </div>
</template>
<script>
  import exampleImg from '@/assets/upc-img-example.jpg'
  import ProductPicture from '@/components/product-picture'

  export default {
    name: 'upc-image',
    props: {
      value: String,
      disabled: Boolean
    },
    data () {
      return {
        exampleImg
      }
    },
    components: {
      ProductPicture
    },
    methods: {
      handleImageChange (valList = []) {
        this.$emit('on-change', valList[0])
      }
    }
  }
</script>
<style lang="less" scoped>
  .upc-image {
    display: flex;
    align-items: center;
    .example-container {
      position: relative;
      padding-left: 14px;
      .arrow {
        position: absolute;
        width: 0;
        height: 0;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        border: 7px solid transparent;
        border-right-color: hsla(0,0%,85%,.5);
        &::before {
          position: absolute;
          content: '';
          top: 0;
          left: 1px;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          border: 7px solid transparent;
          border-right-color: #fff;
        }
      }
    }
    .example {
      border-radius: 2px;
      box-shadow: 0 1px 6px rgba(0,0,0,.2);
      /deep/ .picture-box {
        margin: 0;
      }
      /deep/ .pic-container {
        border: none;
      }
    }
  }
</style>
