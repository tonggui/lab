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
            <div class="link-btn" @click="relate(item)">编辑关联商品</div>
            <div class="link-btn">删除</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import VideoInfo from './video-info'

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
  methods: {
    relate (video) {
      this.$emit('relate', video)
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
      }
    }
  }
</style>
<style lang="less" scoped>
.disabled {
  color: @color-disabled;
}
</style>
