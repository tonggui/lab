<template>
  <div class="video-list">
    <table class="video-table">
      <thead>
        <tr>
          <th>视频名称</th>
          <th>关联商品</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="item.id || index">
          <td>
            <video-info :data="item" @preview="$listeners.preview"></video-info>
          </td>
          <td width="30%">
            <template v-if="item.relSpuList && item.relSpuList.length">
              <div :key="spu.id" v-for="spu in item.relSpuList" class="related">{{ spu.name }}</div>
            </template>
            <div v-else class="disabled">未关联商品</div>
          </td>
          <td width="160">
            <!-- 正在上传的视频没有id，只有有id的视频才能操作 -->
            <template v-if="!!item.id">
              <div class="link-btn" @click="relate(item)" :class="{ disabled: !allowRelate(item) }">编辑关联商品</div>
              <div class="link-btn" @click="del(item)">删除</div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import VideoInfo from './video-info'
import { VIDEO_STATUS } from '../constant'

export default {
  name: 'video-list',
  components: { VideoInfo },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      VIDEO_STATUS
    }
  },
  methods: {
    allowRelate (video) {
      return video && video.status === VIDEO_STATUS.SUCCESS
    },
    relate (video) {
      if (this.allowRelate(video)) {
        this.$emit('relate', video)
      }
    },
    del (video) {
      let msg = ''
      if (video.relSpuList && video.relSpuList.length) {
        msg = `删除视频后，${video.relSpuList.length}个商品将不再展示此视频，请确认是否需要删除`
      } else {
        msg = '确认删除此视频'
      }
      this.$Modal.confirm({
        title: msg,
        content: '',
        onOk: () => {
          console.log(video.id)
        }
      })
    }
  }
}
</script>

<style lang="less">
  .video-list {
    .video-table {
      width: 100%;
      border-spacing: 0;
      border: 0;
      line-height: 1.25;
      thead {
        background: @color-gray1;
        th {
          padding: 10px 20px;
        }
      }
      tbody {
        tr {
          vertical-align: top;
          .edit-btn {
            visibility: hidden;
          }
          &:hover {
            background: @color-gray1;
            .edit-btn {
              visibility: visible !important;
            }
          }
        }
        td {
          padding: 20px;
          border-bottom: 1px solid @color-bg;
        }
      }
      .related {
        margin: 10px 0;
      }
      .disabled {
        margin: 10px 0;
      }
      .link-btn {
        color: @color-link;
        cursor: pointer;
        margin: 10px 0;
        &.disabled {
          color: @color-weak;
          cursor: not-allowed;
        }
      }
    }
  }
  .disabled {
    color: @color-disabled;
  }
</style>
