<template>
  <label :class="['imgs-select-label', { 'is-disabled': maxNum <= 0 || reading || loading }]" @click="handleClick">
    <input
      id="multiFilesInput"
      class="multi-imgs-upload"
      ref="multiFilesInput"
      type="file"
      name="file"
      multiple
      :accept="accept || 'image/*'"
      :disabled="maxNum <= 0 || reading || loading"
      @change="handleFileChange"
    />
    <Icon local="picture" class="icon-picture" />
    <span>{{ loading ? '处理中...' : btnText }}</span>
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
        default: 'image/jpg,image/jpeg,image/png,image/bmp'
      },
      formatErrMsg: { // 格式错误提示文案
        type: String,
        default: '请选择符合要求的图片文件'
      },
      singleFileMaxSize: { // 单张图片大小上限，单位 M
        type: [Number, String],
        default: 2
      },
      loading: { // 正在读取或者上传中
        type: Boolean,
        required: true
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
        if (this.loading) {
          this.$Message.warning('还有文件正在处理中。。。')
          return
        }
        if (this.reading) {
          this.$Message.warning('正在读取文件。。。')
          return
        }
        if (this.maxNum <= 0) {
          this.$Message.warning('已达到图片数量上限')
        }
      },
      isImage (file) {
        const accept = this.accept.split(',')
        return accept.includes(file.type)
      },
      readFile (file) {
        const promise = new Promise(resolve => {
          // 读取图片
          const reader = new FileReader()
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.readAsDataURL(file)
        })
        return promise
      },
      async handleFileChange (e) {
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
        for (let i = 0; i < files.length; i++) {
          const fileI = files[i]

          if (!this.isImage(fileI)) { // 检查文件是否图片格式
            this.$Message.warning(this.formatErrMsg)
          } else if (this.singleFileMaxSize && (fileI.size >= this.singleFileMaxSize * 1024 * 1024)) { // 检查单张图片不超过 singleFileMaxSize 上限
            this.$Message.warning(`图片${fileI.name}大小超过了 ${this.singleFileMaxSize}M，请重新上传`, 3000)
          } else {
            const reader = await this.readFile(fileI)
            this.picFiles.push({ file: fileI, base64: reader })
          }
        }
        this.reading = false
        this.$refs.multiFilesInput.value = ''
        this.$emit('change', this.picFiles)
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
  background: #fff;
  border-radius: 2px;
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
  &.is-disabled {
    cursor: not-allowed;
    span {
      color: @disabled-color;
    }
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
  &.is-disabled {
    .icon-picture {
      path {
        stroke: @disabled-color;
      }
    }
  }
}
</style>
