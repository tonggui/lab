<template>
  <div class="collapse-panel" :class="{ enabled: enabled, collapse: !showContent }">
    <div class="collapse-panel-header" @click="handleHeaderClickEvent">
      <slot name="header">
        <div v-if="title" class="collapse-panel-title">{{title}}</div>
        <Icon v-if="enabled" class="collapse-indicator" type="expand-more" />
      </slot>
    </div>
    <AutoExpand>
      <div class="collapse-panel-content" v-show="showContent">
        <slot />
      </div>
    </AutoExpand>
  </div>
</template>

<script>
  import AutoExpand from '@/transitions/auto-expand'
  export default {
    name: 'CollapsePanel',
    components: {
      AutoExpand
    },
    props: {
      title: String,
      enabled: Boolean,
      // 暂无受控诉求
      collapsed: {
        type: Boolean,
        default: () => false
      }
    },
    data () {
      return {
        showContent: !this.collapsed
      }
    },
    methods: {
      handleHeaderClickEvent () {
        if (!this.enabled) {
          return
        }
        this.showContent = !this.showContent
      }
    }
  }
</script>

<style scoped lang="less">
.collapse-panel {
  border: 1px solid #E9EAF2;
  border-radius: 2px;
  padding: 10px 20px;

  &.enabled {
    .collapse-panel-header {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .collapse-panel-title::after {
      content: ' ';
      margin-left: 6px;
    }
  }

  .collapse-indicator {
    margin-left: 0;
    font-size: 20px;
    transform: rotate(180deg);
    transition: transform ease-out .3s;
  }

  &.collapse {
    .collapse-panel-header {
      margin-bottom: 0;
    }
    .collapse-indicator {
      transform: rotate(0);
    }
  }

  .collapse-panel-header {
    margin-bottom: 6px;
  }
  .collapse-panel-title {
    font-size: 12px;
    color: #000000;
    font-weight: 600;
  }

  .collapse-panel-content {
  }
}
</style>
