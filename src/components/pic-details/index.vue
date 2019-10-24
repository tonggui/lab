<template>
  <div :class="['pic-details', { 'no-pic': noPic }]">
    <div class="uploader-container">
      <MultiImgsUpload
        ref="multiUpload"
        :max-num="maxPicsNum"
        :accept="accept"
        :format-err-msg="formatErrMsg"
        :single-file-max-size="singleFileMaxSize"
        :loading="submitting"
        @change="handleInputChange"
      />
    </div>
    <div :class="['image-box', { 'no-pic': noPic }]">
      <PicDisplay
        v-for="(item, index) in pics" :key="`${index}-${item.src}`"
        :src="item.src || item.base64"
        :move-up="index > 0"
        :move-down="index < pics.length - 1"
        :re-upload="item.error || false"
        @move="move => handleMove(move, index)"
        @delete-pic="handleDelete(index)"
        @upload-again="handleReUpload(index)"
      />
    </div>
  </div>
</template>

<script>
  import MultiImgsUpload from './multi-imgs-upload-btn'
  import PicDisplay from './pic-details-display'
  import {
    fetchUploadImageByFile
  } from '@/data/repos/common'

  export default {
    name: 'pic-details',
    components: {
      MultiImgsUpload,
      PicDisplay
    },
    props: {
      value: { // 图片数组
        type: Array,
        default: () => []
      },
      accept: { // 允许上传的图片类型
        type: String
      },
      formatErrMsg: { // 格式错误提示文案
        type: String
      },
      singleFileMaxSize: { // 单张图片大小上限，单位 M
        type: [Number, String]
      }
    },
    data () {
      return {
        pics: [], // 组件内部state
        picsToUpload: [], // 待上传的图片文件数组
        submitting: false // 图片上传中
      }
    },
    computed: {
      filteredPics () {
        return this.pics.filter(p => p.src || p.base64)
      },
      convertedPics () {
        return this.pics.filter(p => p.src).map(p => p.src)
      },
      noPic () {
        return this.filteredPics.length === 0
      },
      maxPicsNum () {
        return 20 - this.filteredPics.length
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (val) {
          if (!val.length) return
          val.forEach(v => {
            const index = this.pics.findIndex(item => item.src === v)
            if (index === -1) {
              this.pics.push({ src: v })
            }
          })
        }
      },
      pics () {
        this.$emit('change', this.convertedPics)
      }
    },
    methods: {
      compare (item, pf) {
        if (item.file) {
          return item.file.name === pf.file.name && item.file.lastModified === pf.file.lastModified && item.file.size === pf.file.size
        }
        return false
      },
      handleAddedPics (picFiles) {
        const promise = new Promise(resolve => {
          picFiles.forEach(p => {
            const pInPics = this.pics.findIndex(item => this.compare(item, p))
            const pInPicsToUpload = this.picsToUpload.findIndex(item => this.compare(item, p))
            if (pInPics === -1 && pInPicsToUpload === -1) {
              this.picsToUpload.push(p)
            } else {
              this.$Message.warning(`${p.file.name} 重复了`)
            }
          })
          resolve()
        })
        return promise
      },
      handleInputChange (picFiles) {
        this.handleAddedPics(picFiles).then(async () => {
          this.submitting = true
          while (this.picsToUpload.length) {
            const v = this.picsToUpload.splice(0, 1)
            const file = v[0].file
            const base64 = v[0].base64
            try {
              const res = await fetchUploadImageByFile({ file })
              this.pics.push({ file, src: res, base64 })
            } catch (err) {
              const msg = err.message ? `${file.name}上传失败原因：${err.message}` : `${file.name}上传失败！`
              this.$Message.error(msg)
              this.pics.push({ file, base64, error: true })
            }
          }
        }).finally(() => {
          this.submitting = false
        })
      },
      handleMove (move, index) {
        const pic = this.pics.splice(index, 1)
        this.pics.splice(index + move, 0, pic[0])
        this.$emit('change', this.convertedPics)
      },
      handleDelete (index) {
        this.pics.splice(index, 1)
        this.$emit('change', this.convertedPics)
      },
      async handleReUpload (index) {
        this.submitting = true
        const file = this.pics[index].file
        const base64 = this.pics[index].base64
        try {
          const res = await fetchUploadImageByFile({ file })
          this.pics.splice(index, 1, { file, src: res, base64 })
          this.$emit('change', this.convertedPics)
        } catch (err) {
          const msg = err.message ? `${file.name}上传失败原因：${err.message}` : `${file.name}上传失败！`
          this.$Message.error(msg)
        } finally {
          this.submitting = false
        }
      }
    },
    created () {
    }
  }
</script>

<style lang='less' scoped>
.pic-details {
  display: inline-block;
  width: 750px;
  height: 500px;
  padding: 0;
  border: 1px solid @border-color-base;
  border-radius: 2px;
  &.no-pic {
    height: 200px;
  }
  .uploader-container {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 13px;
    color: #676767;
    padding: 0 10px;
    background-color: #FAFAFA;
    border-bottom: 1px solid @border-color-base;
  }
  .image-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 438px;
    padding: 20px 0;
    overflow-y: auto;
    &.no-pic {
      height: 140px;
    }
  }
}
</style>
