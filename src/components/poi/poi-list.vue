<template>
  <div class="poi-list">
    <div class="poi-list-table">
      <slot name="header">
        <div style="display: table-caption">
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
        v-for="(poi, idx) in pois"
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
  </div>
</template>

<script>
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
      disabledIdList: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        pois: []
      }
    },
    watch: {
      poiList: {
        immediate: true,
        handler (poiList) {
          this.pois = poiList
        }
      }
    },
    computed: {
      isAllowClear () {
        if (!this.allowClear) return false
        if (this.pois.every(poi => this.disabledIdList.includes(poi.id))) return false
        return true
      }
    },
    methods: {
      isDisabled (poi) {
        return this.disabledIdList.includes(poi.id)
      },
      handleClose (poi, idx) {
        if (this.isDisabled(poi)) {
          return
        }
        this.pois.splice(idx, 1)
        this.$emit('on-change', this.pois)
      },
      clear () {
        const remainList = this.pois.filter(poi => this.disabledIdList.includes(poi.id))
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
      &-th {
        padding-top: 16px;
      }
      &-th, &-tr {
        display: table-row;
        font-size: @font-size-base;
      }
      &-tr[disabled] {
        color: @disabled-color;
        cursor: not-allowed;
        &:hover {
          color: @disabled-color;
        }
      }
      &-tr:hover {
        background: @hover-bg;
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
  }
</style>
