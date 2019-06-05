<template>
  <div class="image-cropper">
    <vue-cropper
      class="cropper"
      ref="cropperRef"
      :img="srcSelf"
      :autoCrop="true"
      :canMove="false"
      :full="true"
      infoTrue
      :fixed="!!ratio.value"
      :fixedNumber="ratio.value || []"
      @real-time="realTime"
    ></vue-cropper>
    <div class="extra-container">
      <div
        v-show="previews.url"
        class="show-preview"
        :style="{ height: previewBoxHeight }"
      >
        <div :style="previewStyle1">
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
      </div>
      <div class="opt-container">
        <Button
          type="primary"
          :disabled="!!error"
          :loading="loading"
          @click="handleUsePreview"
        >
          使用预览图
        </Button>
        <Button @click="handleCancelClick">取消</Button>
      </div>
      <div v-show="error" class="error">{{ error }}</div>
    </div>
    <div class="additions">
      <div class="boo-upload boo-upload-select">
        <input
          type="file"
          id="fileInput"
          accept="image/jpeg,image/png"
          class="boo-upload-input"
          @change="handleFileChanged"
        />
        <button
          type="button"
          class="boo-btn boo-btn-default"
          onclick="fileInput.click()"
        >
          <span>重新选择图片</span>
        </button>
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
import isArray from "lodash/isArray";
import { handleFileChange } from "@/common/fileUtils";
import { VueCropper } from "vue-cropper";
const pid = `pid_${Date.now()}${Math.floor(10000 * Math.random())}`;
export default {
  name: "cropper",
  props: {
    src: {
      type: String,
      default: ""
    },
    minCropWidth: {
      type: Number,
      default: 0
    },
    minCropHeight: {
      type: Number,
      default: 0
    },
    reselect: {
      type: Boolean,
      default: false
    },
    aspectRatios: {
      type: Array,
      default: () => [{ label: "力荐", value: 1 }],
      validator: val => {
        return val.every(
          it =>
            it.label &&
            typeof it.label === "string" &&
            it.value &&
            isArray(it.value) &&
            it.value.length === 2
        );
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ratio: this.aspectRatios.length > 0 ? this.aspectRatios[0] : {},
      pid,
      srcSelf: this.src,
      previews: {},
      previewStyle1: {},
      error: ""
    };
  },
  computed: {
    previewBoxHeight() {
      const [x, y] = this.ratio.value;
      return (180 * y) / x;
    }
  },
  created() {
    this.handleFileChanged = handleFileChange(result => {
      this.srcSelf = result;
    });
  },
  methods: {
    handleUsePreview() {
      // const canvas = this.$refs.cropperRef.getCroppedCanvas();
      // 获取截图的base64 数据
      this.$refs.cropperRef.getCropData(data => {
        // do something
        console.log(data);
      });

      // 获取截图的blob数据
      this.$refs.cropperRef.getCropBlob(data => {
        // do something
        console.log(data);
      });
      // this.$emit("confirm", canvas);
    },

    handleCancelClick() {
      this.$emit("cancel");
    },

    realTime(data) {
      var previews = data;
      var h = 180 / previews.w;

      this.previewStyle1 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: h
      };
      this.previews = data;
      if (data.url) {
        this.handleCropEvent(data);
      }
    },

    handleCropEvent(data) {
      const scale = data.img.transform.match(/scale\(([\d.]*)\)/)[1] || 1;
      const cropedWidth = Math.round(data.w) / scale;
      const cropedHeight = Math.round(data.h) / scale;
      if (
        cropedWidth < this.minCropWidth ||
        cropedHeight < this.minCropHeight
      ) {
        const items = [
          {
            label: "宽度",
            value: this.minCropWidth
          },
          {
            label: "高度",
            value: this.minCropHeight
          }
        ].filter(item => item.value > 0);
        this.error = `裁剪后的图片内容：${items
          .map(item => `${item.label}必须大于${item.value}`)
          .join("，")}`;
        return;
      } else {
        this.error = null;
      }
      this.$emit("crop", data);
    },

    handleRatioTypeChanged(val) {
      this.ratio = this.aspectRatios.filter(it => it.label === val)[0];
      this.$nextTick(() => {
        if (this.srcSelf) {
          this.$refs.cropperRef.goAutoCrop();
        }
      });
    }
  },
  components: {
    VueCropper
  }
};
</script>

<style scoped lang="less">
:root {
  --theme-color: #f8b500;
}

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
    border: 1px solid var(--border-color);
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
      .ant-btn {
        position: relative;
        > input[type="file"] {
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

      .ant-radio-group {
        flex: 1;
        text-align: right;
      }
    }
  }
}

.cropper {
  :global {
    .cropper-line,
    .cropper-point {
      background-color: var(--theme-color);
    }
    .cropper-dashed {
      border: 1px solid var(--theme-color);
      opacity: 0.7;
    }
    .cropper-view-box {
      outline: 1px solid var(--theme-color);
      outline-color: rgba(248, 181, 0, 0.75);
    }
  }
}
</style>
