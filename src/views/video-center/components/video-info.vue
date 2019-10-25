<template>
  <div class="video-info">
    <div class="video-status" :style="{ backgroundImage: `url(${data.poster || ''})` }" @click="preview">
      <div class="video-duration" v-if="data.duration">
        {{ data.duration | duration }}
      </div>
      <status-tip :video="data" />
    </div>
    <div class="video-meta">
      <h3>
        <edit-input :value="data.title || data.name" :displayMaxWidth="300" :disabled="!data.id" :on-confirm="save"></edit-input>
      </h3>
      <p v-if="data.ctime">发布时间：{{ (data.ctime || 0) * 1000 | datetime('YYYY-MM-DD HH:mm:ss') }}</p>
      <!-- 上传中的视频没有id，并且size单位是B，而正常视频size单位是MB -->
      <p v-if="data.id">大小：{{ data.size || 0 | capacity('M') }}</p>
      <p v-else-if="data.size">大小：{{ data.size || 0 | capacity('B') }}</p>
    </div>
  </div>
</template>

<script>
  import EditInput from '@/components/edit-input/edit-input'
  import StatusTip from '@/components/product-video/status-tip'
  import { saveVideo } from '@/data/repos/videoRepository'

  export default {
    name: 'video-info',
    components: { EditInput, StatusTip },
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        editing: false
      }
    },
    methods: {
      // 视频预览
      preview () {
        this.$emit('preview', this.data)
      },
      // 保存视频名称
      save (val) {
        if (val === this.data.title) return
        if (!val) {
          this.$Message.warning('视频名称不能为空')
          return false
        }
        return saveVideo({
          ...this.data,
          title: val
        }).then(data => {
          this.data.title = val
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.video-info {
  display: flex;
  align-items: center;
  .video-status {
    position: relative;
    width: 144px;
    height: 81px;
    margin-right: 20px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-color: rgba(0,0,0,.1);
    cursor: pointer;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.2);
    }
    .video-duration {
      position: absolute;
      right: 5px;
      bottom: 5px;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 2px;
      font-size: 12px;
      line-height: 1;
      color: #fff;
      padding: 3px 6px;
      z-index: 1;
    }
  }
  .video-meta {
    h3 {
      font-size: 14px;
      font-weight: bold;
    }
    p {
      color: @text-description-color;
      margin: 5px 0;
    }
  }
}
</style>
