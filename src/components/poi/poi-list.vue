<template>
  <div class="poi-list" ref="container" @scroll="handleScroll">
    <div class="poi-list-table">
      <slot name="header">
        <div class="poi-list-table-header">
          <div class="header-info">
            <span>已选门店：{{pois.length}}</span>
            <span class="tips" v-if="tip">{{tip}}</span>
            <span v-if="allowClear"  @click="clear" class="clear-btn" :disabled="!isAllowClear">
              <Icon local="trash" />清空
            </span>
          </div>
        </div>
        <div v-if="pois.length" class="poi-list-table-th">
          <span class="poi-list-table-cell" style="width: 100px;">门店ID</span>
          <span class="poi-list-table-cell">门店名称</span>
          <span class="poi-list-table-cell" style="width: 58px" />
        </div>
      </slot>
      <div
        v-for="(poi, idx) in displayPoiList"
        :key="idx"
        class="poi-list-table-tr"
        :disabled="isDisabled(poi)"
      >
        <slot name="item" v-bind:poi="poi" v-bind:close="() => handleClose(poi, idx)">
          <span class="poi-list-table-cell">{{ poi.id }}</span>
          <span class="poi-list-table-cell" :title="poi.name">{{ poi.name }}</span>
          <span class="poi-list-table-cell del-btn" @click="handleClose(poi, idx)">
            <Icon type="close" size=18 />
          </span>
        </slot>
      </div>
    </div>
    <div v-if="showLoadMore" ref="loadMore" class="loading-container">
      <Spin>
        <Icon type="loading" size=14></Icon>
      </Spin>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'

  export default {
    name: 'PoiList',
    props: {
      poiList: {
        type: Array,
        default: () => []
      },
      tip: String,
      allowClear: {
        type: Boolean,
        default: true
      },
      disabledIdMap: {
        type: Object,
        default: () => ({})
      },
      pageSize: {
        type: Number,
        default: 20
      }
    },
    mounted () {
      this._ignoreReset = false
    },
    data () {
      return {
        current: 1,
        pois: []
      }
    },
    computed: {
      isAllowClear () {
        if (!this.allowClear) return false
        if (this.pois.every(poi => this.disabledIdMap[poi.id])) return false
        return true
      },
      showLoadMore () {
        return this.displayPoiList.length < this.pois.length
      },
      // 前端分页显示
      displayPoiList () {
        return this.pois.slice(0, this.current * this.pageSize)
      }
    },
    watch: {
      displayPoiList () {
        // 100ms后判断loading是否在视野内，如果在则下一页
        setTimeout(() => {
          this.checkScroll(this.$refs.container, this.$refs.loadMore)
        }, 100)
      },
      poiList: {
        immediate: true,
        handler (poiList) {
          if (!this._ignoreReset) {
            this.current = 1
          }
          this._ignoreReset = false
          this.pois = poiList
        }
      }
    },
    methods: {
      handleScroll (e) {
        this.checkScroll(e.target, this.$refs.loadMore)
      },
      loadMore () {
        this.current++
      },
      checkScroll: debounce(function (container, element) {
        if (!container || !element) return false
        const containerRect = container.getBoundingClientRect()
        const elementRect = element
          ? element.getBoundingClientRect()
          : {
            top: 0
          }
        const loadMore =
          elementRect.top &&
          elementRect.top <= containerRect.top + containerRect.height
        if (loadMore) {
          this.loadMore()
        }
      }, 200),
      isDisabled (poi) {
        return this.disabledIdMap[poi.id]
      },
      handleClose (poi, idx) {
        if (this.isDisabled(poi)) {
          return
        }
        this.pois.splice(idx, 1)
        this.$emit('on-change', this.pois)
        // 单个删除时不用重洗
        this._ignoreReset = true
      },
      clear () {
        const remainList = this.pois.filter(poi => this.disabledIdMap[poi.id])
        this.pois = remainList
        this.$emit('on-change', remainList)
      }
    }
  }
</script>

<style scoped lang="less">
  @padding-vertical: 8px;
  @padding-horizontal: 16px;
  @delete-icon-size: 16px;

  .poi-list {
    display: flex;
    flex-direction: column;
    background: @component-bg;
    position: relative;
    height: 100%;
    overflow-y: auto;

    .header-info {
      display: flex;
      font-size: @font-size-base;
      padding: @padding-vertical @padding-horizontal @padding-vertical - 1px;
      border-bottom: 1px solid @border-color-base;

      > span:first-of-type {
        flex: 1;
      }

      .tips {
        color: @text-tip-color;
      }
    }

    .clear-btn {
      color: @primary-color;
      cursor: pointer;
      &:hover {
        color: rgba(63, 65, 85, .6);
      }
      &[disabled] {
        color: @disabled-color;
        cursor: not-allowed;
        &:hover {
          color: @disabled-color;
        }
      }
      i {
        margin-top: -2px;
        margin-right: 4px;
      }
    }

    &-table {
      display: table;
      width: 100%;
      padding: 14px 0;
      table-layout: fixed;
      &-header {
        display: table-caption;
      }
      &-th,
      &-tr {
        display: table-row;
        font-size: @font-size-base;
      }
      &-th {
        padding-top: 16px;
      }
      &-tr {
        &[disabled] {
          color: @disabled-color;
          cursor: not-allowed;
          &:hover {
            color: @disabled-color;
          }
        }
        &:hover {
          background: @hover-bg;
        }
      }
      &-cell {
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 6px 20px;
        display: table-cell;
        overflow: hidden;
        &.del-btn {
          cursor: pointer;
        }
      }
    }

    .loading-container {
      text-align: center;
      padding: 5px;
    }
  }
</style>
