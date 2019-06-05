<template>
  <div class="container">
    <Cropper
      v-if="cropMode"
      class="cropper"
      :minCropWidth="minWidth"
      :viewMode="1"
      :reselect="true"
      :aspectRatios="aspectRatios"
      :src="src"
      :loading="loading"
      @confirm="handleConfirmResult"
      @cancel="handleCancelClick"
    />
    <template v-else>
      <div class="boo-upload boo-upload-select">
        <input
          type="file"
          id="fileInput"
          accept="image/jpeg,image/png"
          class="boo-upload-input"
          @change="handleFileChangeEvent"
        />
        <Button
          :loading="loading"
          type="primary"
          class="boo-btn boo-btn-default"
          onclick="fileInput.click()"
        >
          <span>选择本地图片</span>
        </Button>
      </div>
      <div class="desc">
        图片支持1:1（600px * 600px）/ 4:3（600 * 450px）
      </div>
      <div class="pics-container">
        <div v-for="(item, idx) in PICTURE_MEMOS" :key="idx" class="pic">
          <img :src="item.src" />
          <div>{{ item.memo }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import isArray from 'lodash/isArray'
import Cropper from '@/components/cropper'
import { handleFileChange } from '@/common/fileUtils'
import { uploadImageFile } from '@/data/repos/commonRepository'
const PICTURE_MEMOS = [
  {
    src:
      '//s3plus.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/picture_upload_examples/good.png',
    memo: '优秀案例'
  },
  {
    src:
      '//s3plus.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/picture_upload_examples/bad1.png',
    memo: '不能含有二维码'
  },
  {
    src:
      '//s3plus.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/picture_upload_examples/bad2.png',
    memo: '图片避免模糊'
  },
  {
    src:
      '//s3plus.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/picture_upload_examples/bad3.png',
    memo: '图片不能翻转、变形'
  },
  {
    src:
      '//s3plus.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/picture_upload_examples/bad4.png',
    memo: '不能含有马赛克'
  }
]
/**
 * events {confirm}
 */
export default {
  name: 'local-upload',
  props: {
    score: {
      type: Boolean,
      default: false
    },
    poiIds: {
      type: Array,
      validator: val => {
        return val.every(
          it => typeof it === 'string' || typeof it === 'number'
        )
      },
      default: () => []
    },
    hasUpc: {
      type: Boolean,
      default: false
    },
    minWidth: {
      type: Number,
      default: 600
    },
    aspectRatios: {
      type: Array,
      default: () => [
        {
          label: '1 / 1',
          value: [1, 1]
        },
        {
          label: '4 / 3',
          value: [4, 3]
        }
      ],
      validator: val => {
        return val.every(
          it =>
            it.label &&
            typeof it.label === 'string' &&
            it.value &&
            isArray(it.value)
        )
      }
    }
  },
  data () {
    return {
      cropMode: false,
      loading: false,
      PICTURE_MEMOS
    }
  },
  created () {
    this.handleFileChangeEvent = handleFileChange(async (result, filename) => {
      try {
        await this.readImageFile(result)
        try {
          this.loading = true
          await this.uploadAndCheckQuality(result, filename)
        } catch {
          this.$Message.error('图片上传失败！')
        } finally {
          this.loading = false
        }
      } catch {
        this.filename = filename
        this.src = result
        this.cropMode = true
      }
    })
  },
  methods: {
    handleCancelClick () {
      this.cropMode = false
      this.src = null
    },

    async uploadAndCheckQuality (multipart, filename) {
      const res = await uploadImageFile(
        multipart,
        filename,
        this.poiIds,
        this.score
      )
      this.checkPictureQuality(res, url => {
        this.$emit('confirm', url)
      })
    },

    async handleConfirmResult (result) {
      this.loading = true
      try {
        const multipart = result.toDataURL('image/jpeg')
        await this.uploadAndCheckQuality(multipart, this.filename)
      } catch {
        this.$Message.error('裁剪图片上传失败！')
      } finally {
        this.loading = false
      }
    },

    readImageFile (base64Source) {
      return new Promise((resolve, reject) => {
        const context = this
        // 如果是不需要裁剪的指定格式，应该直接上传
        const image = new Image()
        image.onload = () => {
          const width = image.naturalWidth
          const height = image.naturalHeight
          if (width >= this.minWidth) {
            const ratio = width / height
            if (context.aspectRatios.find(r => r.value === ratio)) {
              resolve(base64Source)
            } else {
              reject(new Error('不满足直接上传的条件'))
            }
          } else {
            reject(new Error('不满足直接上传的条件'))
          }
        }
        image.onerror = err => reject(err)
        image.src = base64Source
      })
    },

    checkPictureQuality (result, cb) {
      const { lowWhiteRate, poorQuality, url } = result
      if (this.score) {
        let error = ''
        if (poorQuality === 1) {
          error = '检测到图片质量过差，将影响订单量和店铺排名！'
        } else if (poorQuality === 0 && lowWhiteRate === 1 && this.hasUpc) { error = '检测到图片不是白底，上传白底图可以提升下单转化哦！' }
        if (error) {
          this.$Modal.confirm({
            title: '警告',
            content: error,
            okText: '重新选择图片',
            okType: 'danger',
            cancelText: '忽略',
            onCancel () {
              // eslint-disable-next-line standard/no-callback-literal
              cb({
                src: url,
                poor: true
              })
            }
          })
          return
        }
      }
      // eslint-disable-next-line standard/no-callback-literal
      cb({
        src: url,
        poor: false
      })
    }
  },
  components: {
    Cropper
  }
}
</script>

<style scoped lang="less">
.container {
  text-align: center;
  padding: 0 0 20px 0;

  .uploader {
    margin: 20px auto;
    position: relative;

    > input[type="file"] {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 1;
      cursor: pointer;
    }
  }

  .desc {
    font-size: 12px;
    color: var(--gray-1);
    letter-spacing: 0;
  }

  .pics-container {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;

    .pic {
      display: inline-block;
      flex: 1;
      font-size: 12px;

      > img {
        width: 140px;
        height: 105px;
        margin-bottom: 10px;
      }
    }
  }

  .cropper {
    margin: auto;
  }
}
</style>
