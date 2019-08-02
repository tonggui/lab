<template>
  <label class="imgs-select-label" @click="handleClick">
    <input
      id="multiFilesInput"
      class="multi-imgs-upload"
      ref="multiFilesInput"
      type="file"
      name="file"
      multiple
      :accept="accept || 'image/*'"
      :disabled="maxNum <= 0 || reading"
      @change="handleFileChange"
    />
    <Icon local="picture" class="icon-picture" />{{ btnText }}
  </label>
</template>

<script>
  export default {
    name: 'multi-imgs-upload-btn',
    props: {
      btnText: { // 按钮的文案
        type: String,
        default: '上传图片'
      },
      maxNum: { // 本次上传 最大可选文件数；建议传入【文件上限 - 已上传文件数】
        type: [Number, String],
        default: 20
      },
      accept: { // 允许上传的图片类型
        type: String,
        default: 'jpg|jpeg|png|bmp'
      },
      formatErrMsg: { // 格式错误提示文案
        type: String,
        default: '请选择符合要求的图片文件'
      },
      singleFileMaxSize: { // 单张图片大小上限，单位 M
        type: [Number, String],
        default: 2
      }
    },
    data () {
      return {
        reading: false, // 读取本次选择的图片中
        picFiles: []
      }
    },
    computed: {},
    methods: {
      handleClick () {
        if (this.reading) {
          this.$Message.warning('正在读取文件。。。')
          return
        }
        if (this.maxNum <= 0) {
          this.$Message.warning('已达到图片数量上限')
        }
      },
      isImage (file) {
        const reg = new RegExp(`^image/(${this.accept})$`)
        return reg.test(file.type)
      },
      handleFileChange (e) {
        // e.preventDefault()
        this.reading = true
        this.picFiles = []
        const files = e.target.files
        if (!files.length) {
          this.reading = false
          return
        }
        if (this.maxNum && this.maxNum > 0 && files.length > this.maxNum) {
          this.$Message.warning(`本次上传最多允许${this.maxNum}张图片`)
          this.reading = false
          return
        }
        let err = 0
        for (let i = 0; i < files.length; i++) {
          const fileI = files[i]
          // 检查文件是否图片格式
          if (!this.isImage(fileI)) {
            this.$Message.warning(this.formatErrMsg)
            err++
            continue
          }
          // 检查单张图片不超过 singleFileMaxSize 上限
          if (this.singleFileMaxSize && (fileI.size >= this.singleFileMaxSize * 1024 * 1024)) {
            this.$Message.warning(`图片${fileI.name}大小超过了 ${this.singleFileMaxSize}M，请重新上传`, 3000)
            err++
            continue
          }
          // 读取图片
          const reader = new FileReader()
          reader.onload = ev => {
            this.picFiles.push({ file: fileI, base64: ev.target.result })
            if (this.picFiles.length + err === files.length) {
              this.reading = false
              this.$refs.multiFilesInput.value = ''
              this.$emit('change', this.picFiles)
            }
          }
          reader.readAsDataURL(fileI)
        }
      }
    }
  }
</script>

<style lang='less' scoped>
.imgs-select-label {
  position: relative;
  display: inline-block;
  width: 120px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #333;
  text-align: center;
  border: 1px solid @border-color-base;
  margin-bottom: 2px;
  cursor: pointer;
  overflow: hidden;
  .multi-imgs-upload {
    position: absolute;
    width: 100%;
    bottom: 0;
    right: 0;
    z-index: -1;
    visibility: hidden;
  }
  .icon-picture {
    font-size: 16px;
    padding-right: 6px;
    padding-bottom: 2px;
    vertical-align: middle;
  }
}
</style>
<style lang='less'>
.imgs-select-label {
  .icon-picture {
    path {
      stroke: @primary-color;
      stroke-width: 6px;
    }
  }
}
</style>
