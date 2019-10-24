<template>
  <div class="template-container">
    <ErrorBoundary :description="errorDescription" :error="error" @refresh="handleRefresh">
      <div class="template-card" :class="{ 'is-used': used }">
        <div class="template-card-title">适用于</div>
        <div class="template-card-desc">{{ dataSource.description }}</div>
        <small v-if="showTimes">
          使用量<span>{{ dataSource.times }}</span>
        </small>
        <div class="template-card-content">
          <Alert v-if="showWarning" class="alert" type="warning" show-icon>
            {{ warningMessage }}
          </Alert>
          <div class="tag-list-wrapper" v-if="dataSource.loaded">
            <MultiCascadeLocal
              @change="handleChange"
              :dataSource="dataSource.tagInfoList || []"
              :editable="editable"
              :value="dataSource.value"
              default-select-all
              need-parent
              class="tag-list"
              menu-class="tag-list-menu"
              item-class="tag-list-item"
            />
          </div>
          <div v-else class="tag-list">
            <Empty description="数据还未加载完成，请耐心等待" />
          </div>
        </div>
      </div>
    </ErrorBoundary>
    <Spin fix v-if="loading" />
  </div>
</template>
<script>
  import MultiCascadeLocal from '@components/multi-cascade/multi-cascade-local'
  import { TEMPLATE_TYPE } from '@/data/enums/category'

  export default {
    name: 'category-template',
    props: {
      dataSource: {
        type: Object,
        required: true
      },
      editable: Boolean,
      loading: Boolean
    },
    computed: {
      errorDescription () {
        return `哎呦，模版${this.dataSource.name}出错了~`
      },
      error () {
        return !!this.dataSource.error
      },
      used () {
        return this.dataSource.used
      },
      showTimes () {
        return this.dataSource.type !== TEMPLATE_TYPE.CLIENT
      },
      showWarning () {
        const { updated, editable } = this.dataSource
        if (!updated && !editable) {
          return false
        }
        return true
      },
      warningMessage () {
        const { updated, editable } = this.dataSource
        let message = ''
        if (updated) {
          message = '模版已更新，请确认是否需要更新为最新版'
        } else if (editable) {
          message = '模版生成后，取消勾选分类下的商品将会被分配到“未分类”'
        }
        return message
      }
    },
    components: {
      MultiCascadeLocal
    },
    methods: {
      handleRefresh () {
        this.$emit('refresh')
      },
      handleChange (value) {
        this.$emit('change', value)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/styles/common.less';

  .template-container {
    height: 100%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid @border-color-base;
    border-radius: @border-radius-base;
    overflow: hidden;
    position: relative;
    .template-card {
      height: 100%;
      width: 100%;
      display: inline-flex;
      flex-direction: column;
      position: relative;
      color: @text-color;
      &.is-used::after {
        position: absolute;
        top: -7px;
        right: -44px;
        width: 100px;
        height: 0;
        content: '使用中';
        text-align: center;
        font-size: @font-size-small;
        color: @text-color;
        line-height: 24px;
        border-bottom: 24px solid #FFD161;
        border-right: 24px solid #fff;
        border-left: 24px solid #fff;
        transform: rotate(45deg);
      }
      &-title,
      &-desc {
        font-size: @font-size-base;
        font-weight: bold;
        line-height: 22px;
      }
      &-title {
        color: @success-color;
      }
      &-content {
        flex: 1;
        overflow: hidden;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        .alert {
          font-size: @font-size-small;
          padding: 4px;
          padding-left: 26px;
          margin-bottom: 10px;
          /deep/ .boo-alert-icon {
            left: 8px;
            top: 2px;
          }
        }
        .tag-list-wrapper {
          flex: 1;
          overflow: hidden;
          position: relative;
          .tag-list {
            position: absolute;
            top: 0;
            bottom: 0;
          }
          /deep/.tag-list-item {
            padding-top: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f7f7f8;
            &[data-selected=true] {
              color: @link-color;
            }
          }
          /deep/ .tag-list-menu {
            height: 100%;
          }
        }
      }
    }
  }
</style>
