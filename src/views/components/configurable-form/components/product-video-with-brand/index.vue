<template>
  <div>
    <div>
      <ProductVideo
        v-show="!brandMode"
        ref="uploadBox"
        :value="value"
        :disabled="disabled"
        v-on="$listeners"
      />
      <ProductVideoBox
        v-if="brandMode"
        :video="brandVideo"
        tag="品牌商"
      />
      <Tooltip
        :always="!confirmed && brandVideoUsable"
        :disabled="!brandVideoUsable && confirmed"
      >
        <ProductVideoBox
          :video="brandVideo"
          tag="品牌商"
          disabled
        />
        <div slot="content" v-if="!confirmed">
          <div>品牌商提供优质视频，使用有利于销量提升。</div>
          <div>
            <Button v-if="!hasUploadVideo">暂不使用</Button>
            <Button>立即使用</Button>
          </div>
        </div>
      </Tooltip>
    </div>
    <div v-if="hasUploadVideo && brandVideoUsable && brandMode">效果不好？<a @click="uploadVideo">自行上传视频</a></div>
  </div>
</template>

<script>
  import get from 'lodash/get'
  import ProductVideo from '@/components/product-video'
  import ProductVideoBox from '@/components/product-video/video-box'

  export default {
    name: 'ProductVideoWithBrandVideo',
    components: {
      ProductVideo,
      ProductVideoBox
    },
    props: {
      value: {
        type: Object,
        default () {
          return null
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      brandVideo: {
        type: Object,
        default () {
          return null
        }
      },
      // 0-未进行过操作，1-未启用，2-启用
      brandVideoStatus: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        confirmed: false,
        brandMode: false
      }
    },
    computed: {
      hasUploadVideo () {
        return get(this.value, 'status') !== undefined
      },
      brandVideoUsable () {
        return !!this.brandVideo
      }
    },
    watch: {
      brandVideoStatus: {
        immediate: true,
        handler (v) {
          this.brandMode = v === 2
        }
      }
    },
    methods: {
      uploadVideo () {
        this.changeBrandVideoStatus(true)
        if (this.$refs.uploadBox) {
          this.$refs.uploadBox.showUploadModal()
        }
      },
      changeBrandVideoStatus (isBrandMode) {
        this.brandMode = isBrandMode
        this.$emit('videoModeChanged', isBrandMode ? 2 : 1)
      }
    }
  }
</script>

<style scoped>

</style>
