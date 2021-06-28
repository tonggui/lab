<template>
  <div>
    <div v-if="needSync">
      <Checkbox v-model="sync">保存后，会保留门店中此商品已上传的图片详情。（取消勾选：保存后，门店中此商品若已上传图片详情将会同步删除清空）</Checkbox>
    </div>
    <div :class="['pic-details', { 'no-pic': noPic }]">
      <div class="uploader-container">
        <MultiImgsUpload
          ref="multiUpload"
          :max-num="maxPicsNum"
          :accept="accept"
          :format-err-msg="formatErrMsg"
          :single-file-max-size="singleFileMaxSize"
          :loading="submitting"
          :disabled="disabled"
          @change="handleInputChange"
        />
        <div v-if="!noPic" class="preview" @click="handlePreview">效果预览</div>
      </div>
      <div :class="['image-box', { 'no-pic': noPic }]">
        <PicDisplay
          v-for="(item, index) in pics" :key="`${index}-${item.src}`"
          :src="item.src || item.base64"
          :move-up="index > 0"
          :move-down="index < pics.length - 1"
          :re-upload="item.error || false"
          :disabled="disabled"
          @move="move => handleMove(move, index)"
          @delete-pic="handleDelete(index)"
          @upload-again="handleReUpload(index)"
        />
      </div>
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
      needSync: Boolean,
      disabled: Boolean,
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
      },
      picSync: Boolean
    },
    data () {
      return {
        sync: true,
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
      needSync (val) {
        // 不能勾选情况下，默认可以同步到门店
        if (!val) this.$emit('change-sync', val)
      },
      picSync (val) {
        this.sync = val
      },
      sync (val) {
        this.$emit('change-sync', val)
      },
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
      handlePreview () {
        const pics = this.pics
        this.$Modal.open({
          className: 'pic-detail-preview-container',
          title: '图片详情',
          footerHide: true,
          render () {
            return <ul class="preview-container">
              {
                pics.map(({ base64, src }) => <li>
                  <img src={base64 || src} width="200" />
                </li>)
              }
            </ul>
          }
        })
      },
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

<style lang='less'>
.pic-detail-preview-container {
  .preview-container {
    list-style: none;
    text-align: center;
    > li {
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang='less' scoped>
.pic-details {
  display: block;
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
    .preview {
      height: 40px;
      line-height: 40px;
      width: 120px;
      border: 1px solid #E9EAF2;
      text-align: center;
      margin-left: 10px;
      background: #fff;
      cursor: pointer;
      color: #333;
      font-size: 14px;
    }
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
