<template>
  <div class="image-cropper">
    <ImageCropper
      v-bind="$attrs"
      class="cropper"
      ref="cropper"
      :src="srcSelf"
      :preview="`#${pid}`"
      :aspectRatio="ratio.value"
      :crop="handleCropEvent"
    />
    <div class="extra-container">
      <div :id="pid" class="preview"/>
      <div class="opt-container">
        <Button
          type="primary"
          :disabled="!!error"
          :loading="loading"
          @click="handleUsePreview"
        >使用预览图</Button>
        <Button @click="handleCancelClick">取消</Button>
      </div>
      <div v-show="error" class="error">{{ error }}</div>
    </div>
    <div class="additions">
      <div>
        <Button :disabled="loading">
          重新选择图片
          <input
            type="file"
            accept="image/jpeg,image/png"
            @change="handleFileChanged"
          />
        </Button>
      </div>
      <RadioGroup
        v-if="aspectRatios.length > 0"
        @on-change="handleRatioTypeChanged"
        :value="ratio.label"
      >
        <Radio
          v-for="(item, index) in aspectRatios"
          :label="item.label"
          :key="index"
        >
          {{ item.label }}
        </Radio>
      </RadioGroup>
    </div>
  </div>
</template>

<script>
  import { handleFileChange } from '@/common/fileUtils'
  import ImageCropper from 'vue-cropperjs'
  import 'cropperjs/dist/cropper.css'

  export default {
    name: 'Cropper',
    props: {
      src: {
        type: String,
        default: ''
      },
      minCropWidth: {
        type: Number,
        default: 0
      },
      minCropHeight: {
        type: Number,
        default: 0
      },
      reselect: Boolean,
      aspectRatios: {
        type: Array,
        default: () => []
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        ratio: this.aspectRatios.length > 0 ? this.aspectRatios[0] : {},
        srcSelf: this.src,
        error: ''
      }
    },
    computed: {
      pid () {
        return `pid_${Date.now()}${Math.floor(10000 * Math.random())}`
      }
    },
    watch: {
      src (v) {
        if (v !== this.srcSelf) {
          this.srcSelf = v
        }
      }
    },
    methods: {
      handleUsePreview () {
        const cropper = this.$refs.cropper
        if (cropper) {
          this.$emit('confirm', cropper.getCroppedCanvas())
        }
      },
      handleCancelClick () {
        this.$emit('cancel')
      },
      handleCropEvent (e) {
        const data = e.detail
        const cropedWidth = Math.round(data.width)
        const cropedHeight = Math.round(data.height)
        if (
          cropedWidth < this.minCropWidth ||
          cropedHeight < this.minCropHeight
        ) {
          const items = [
            {
              label: '宽度',
              value: this.minCropWidth
            },
            {
              label: '高度',
              value: this.minCropHeight
            }
          ].filter(item => item.value > 0)
          this.error = `裁剪后的图片内容：${items.map(item => `${item.label}必须大于${item.value}`).join('，')}`
          return
        } else {
          this.error = null
        }
        this.$emit('crop', data)
      },
      handleRatioTypeChanged (val) {
        this.ratio = this.aspectRatios.filter(it => it.label === val)[0]
        this.$refs.cropper.setAspectRatio(this.ratio.value)
      }
    },
    created () {
      this.handleFileChanged = handleFileChange(result => {
        this.srcSelf = result
      })
    },
    components: {
      ImageCropper
    }
  }
</script>

<style scoped lang="less">
.image-cropper {
  width: 600px;

  .cropper {
    display: inline-block;
    vertical-align: top;
    width: 400px;
    height: 300px;
  }

  .extra-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
    width: 180px;
  }

  .preview {
    width: 180px;
    height: 180px;
    border: 1px solid @border-color-base;
    overflow: hidden;
  }

  .opt-container {
    margin-top: 10px;
    width: 180px;
    display: flex;
    justify-content: space-between;
  }

  .error {
    margin-top: 10px;
    color: red;
  }

  .additions {
    display: flex;
    width: 400px;
    margin-top: 10px;
    vertical-align: middle;
    line-height: 32px;
    justify-content: space-between;

    :global {
      .boo-btn {
        position: relative;
        input[type="file"] {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          z-index: 1;
          cursor: pointer;
        }
      }

      .boo-radio-group {
        flex: 1;
        text-align: right;
      }
    }
  }
}

.cropper {
  /deep/ .cropper-container {
    .cropper-line,
    .cropper-point {
      background-color: @brand-auxiliaray-color-1;
    }
    .cropper-dashed {
      border: 1px solid @brand-auxiliaray-color-1;
      opacity: 0.7;
    }
    .cropper-view-box {
      outline: 1px solid @brand-auxiliaray-color-1;
      outline-color: rgba(248, 181, 0, 0.75);
    }
  }
}
</style>
