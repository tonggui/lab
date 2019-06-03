<template>
  <div class="video-info">
    <div class="video-status" :style="{ backgroundImage: `url(${data.main_pic_small_url || ''})` }" @click="preview">
      <div class="video-duration" v-if="data.length">
        {{ data.length | duration }}
      </div>
    </div>
    <div class="video-meta">
      <h3>
        <edit-input :value="data.name" :displayMaxWidth="300"></edit-input>
      </h3>
      <p>发布时间：{{ data.ctime || 0 | datetime('YYYY-MM-DD') }}</p>
      <p>大小：{{ data.size || 0 | capacity('M') }}</p>
    </div>
  </div>
</template>

<script>
import EditInput from '@/components/edit-input/edit-input'

export default {
  name: 'video-info',
  components: { EditInput },
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
    preview () {
      this.$emit('preview', this.data)
    },
    edit () {
      this.editing = true
    }
  }
}
</script>

<style lang="less" scoped>
.edit-btn {
  color: @color-link;
  display: none;
  cursor: pointer;
}
.video-info {
  display: flex;
  align-items: center;
  .video-status {
    position: relative;
    width: 144px;
    height: 81px;
    margin-right: 10px;
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
      color: @color-gray5;
    }
  }
}
</style>
