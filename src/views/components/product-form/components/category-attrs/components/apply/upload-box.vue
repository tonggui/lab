<template>
  <div class="upload-box">
    <Upload
      multiple
      action=""
      name="multipart"
      class="upload"
      ref="upload"
      :before-upload="beforeUpload"
      :accept="accept"
      :show-upload-list="false"
      v-bind="$attrs"
      >
      <PictureBox
        :src="value"
        :required="required"
        :description="description"
        @delete="del"
      />
    </Upload>
  </div>
</template>

<script>
  import { Img2Base64 } from '@/common/utils'
  import { fetchUploadImageByBase64 } from '@/data/repos/common'
  import PictureBox from '@/components/product-picture/picture-box'

  export default {
    name: 'upload-box',
    components: { PictureBox },
    props: {
      accept: {
        type: String,
        default: 'image/*'
      },
      value: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      beforeUpload (file) {
        const maxSize = 2
        const sizeValid = file.size / 1024 / 1024 < maxSize
        if (!sizeValid) {
          this.$Message.warning({
            content: `单个图片大小不能超过${maxSize}MB!`,
            duration: 4
          })
          return false
        }
        this.upload(file)
        // 阻止默认上传使用自定义上传方法
        return false
      },
      async upload (file) {
        try {
          const base64 = await Img2Base64(file)
          const data = await fetchUploadImageByBase64(base64, file.name, undefined, false)
          this.$emit('change', data.url)
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      del () {
        this.$emit('change', '')
      }
    }
  }
</script>

<style lang="less" scoped>
  .upload-box {
    display: inline-block;
    margin-right: 20px;
  }
</style>
