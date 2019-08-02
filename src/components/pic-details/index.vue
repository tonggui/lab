<template>
  <div :class="['pic-details', { 'no-pic': noPic }]">
    <div class="uploader-container">
      <MultiImgsUpload
        ref="multiUpload"
        :max-num="maxPicsNum"
        :accept="accept"
        :format-err-msg="formatErrMsg"
        :single-file-max-size="singleFileMaxSize"
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
        picsToUpload: [] // 待上传的图片文件数组
      }
    },
    computed: {
      noPic () {
        return this.pics.length === 0
      },
      maxPicsNum () {
        return 20 - this.pics.length
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (val) {
          if (val !== this.pics) {
            this.pics = val
          }
        }
      },
      pics (val, old) {
        if (val !== old) {
          this.$emit('change', val)
        }
      },
      picsToUpload (val) {
        while (val.length) {
          const v = val.splice(0, 1)
          this.postUploadPics(v[0].file, v[0].base64)
        }
      }
    },
    methods: {
      compare (item, pf) {
        if (item.file) {
          return item.file.name === pf.file.name && item.file.lastModified === pf.file.lastModified && item.file.size === pf.file.size
        }
        return false
      },
      async postUploadPics (file, base64, index) {
        let picObj = { file, base64 }
        try {
          const res = await fetchUploadImageByFile({ file })
          picObj = Object.assign({}, picObj, res ? { src: res } : { error: true })
          index === undefined ? this.pics.push(picObj) : this.$set(this.pics, index, picObj)
        } catch (err) {
          picObj = Object.assign({}, picObj, { error: true })
          index === undefined ? this.pics.push(picObj) : this.$set(this.pics, index, picObj)
          this.$Message.error(`${file.name}上传失败原因：${err.message}`)
        }
      },
      handleInputChange (picFiles) {
        picFiles.forEach(pf => {
          const pfInPics = this.pics.findIndex(item => this.compare(item, pf))
          const pfInPicsToUpload = this.picsToUpload.findIndex(item => this.compare(item, pf))
          if (pfInPics === -1 && pfInPicsToUpload === -1) {
            this.picsToUpload.push(pf)
          } else {
            this.$Message.warning(`${pf.file.name} 重复了`)
          }
        })
      },
      handleMove (move, index) {
        const pic = this.pics.splice(index, 1)
        this.pics.splice(index + move, 0, pic[0])
        this.$emit('change', this.pics)
      },
      handleDelete (index) {
        this.pics.splice(index, 1)
        this.$emit('change', this.pics)
      },
      async handleReUpload (index) {
        const file = this.pics[index].file
        const base64 = this.pics[index].base64
        this.postUploadPics(file, base64, index)
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
  border: 1px solid #d2d2d2;
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
    border-bottom: 1px solid #d2d2d2;
  }
  .image-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 438px;
    padding: 10px 0;
    overflow-y: auto;
    &.no-pic {
      height: 140px;
    }
  }
}
</style>
