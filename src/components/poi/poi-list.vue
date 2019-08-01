<template>
  <div class="poi-list">
    <slot name="header">
      <div class="header-info">
        <span>已选门店：{{pois.length}}</span>
        <span class="tips" v-if="tip">{{tip}}</span>
      </div>
      <div v-if="pois.length" class="list-header">
        <span>门店ID</span>
        <span>门店名称</span>
        <Icon v-if="allowClear" type="closed" @click="clear" :disabled="!isAllowClear" alt="清空已选门店"/>
      </div>
    </slot>
    <ul>
      <li
        v-for="(poi, idx) in pois"
        :key="idx"
      >
        <slot name="item" v-bind:poi="poi" v-bind:close="() => handleClose(idx)">
          <div class="poi-list-item">
            <span>{{poi.id}}</span>
            <span>{{poi.name}}</span>
            <Icon type="closed" @click="handleClose(idx)" :disabled="disabledIdList.includes(poi.id)"/>
          </div>
        </slot>
      </li>
    </ul>
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
      handleClose (idx) {
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

    .header-info {
      display: flex;
      padding: @padding-vertical @padding-horizontal @padding-vertical - 1;
      border-bottom: 1px solid @border-color-base;

      > span:first-of-type {
        flex: 1;
      }

      .tips {
        color: @text-tip-color;
      }
    }

    ul, li {
      margin: 0;
      padding: 0;
      list-style: none;
      flex: 1;
      overflow-y: auto;
    }

    .list-header {
      display: flex;
      padding: @padding-vertical @padding-horizontal;
      padding-top: 16px;
      // background: @hover-bg;
      // border-bottom: 1px solid @border-color-base;
      // border-top: 1px solid @border-color-base;

      > span:first-of-type {
        flex: 2;
      }
      > span:nth-of-type(2) {
        flex: 5;
      }

      .boo-icon {
        cursor: pointer;
        font-size: @delete-icon-size;
        line-height: @line-height-computed;
      }
    }

    .poi-list-item {
      display: flex;
      padding: @padding-vertical @padding-horizontal;
      font-size: @font-size-base;
      line-height: @line-height-computed;

      &:hover {
        background: @hover-bg;
      }

      > span:first-of-type {
        flex: 2;
      }
      > span:nth-of-type(2) {
        flex: 5;
      }
      .boo-icon {
        cursor: pointer;
        font-size: @delete-icon-size;
        line-height: @line-height-computed;
      }
    }
  }
</style>
