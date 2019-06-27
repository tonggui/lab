<template>
  <div class="tag-tree">
    <div class="tag" v-for="tag in data" :key="tag.id">
      <div
        class="info"
        @click="select(tag)"
        :class="{ active: tag.id === activeId || (tag.children && tag.children.findIndex(v => v.id === activeId) > -1) }"
        >
        <span class="tag-name">{{ tag.name }}</span>
        <Icon
          class="icon"
          :class="{ expand: tag.id === expandId }"
          type="navigate-next" size="16"
          v-if="tag.children && tag.children.length"
          />
      </div>
      <auto-expand>
        <div class="sub-tag-tree" v-if="tag.children && tag.children.length" v-show="tag.id === expandId">
          <tag-tree :data="tag.children" @select="$listeners.select" :activeId="activeId" />
        </div>
      </auto-expand>
    </div>
  </div>
</template>

<script>
import AutoExpand from '@/transitions/auto-expand/index.vue'

export default {
  name: 'tag-tree',
  components: { AutoExpand },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    activeId: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      expandId: 0
    }
  },
  watch: {
    activeId (activeId) {
      if (!activeId) {
        this.expandId = 0
      }
    }
  },
  methods: {
    select (tag) {
      if (!tag.children || !tag.children.length) {
        this.expandId = 0
        if (tag.id !== this.activeId) {
          this.$emit('select', tag)
        }
      } else {
        if (tag.id === this.expandId) {
          this.expandId = 0
        } else {
          this.expandId = tag.id
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tag-tree {
  .tag {
    margin: 20px 0;
    .sub-tag-tree {
      padding-left: 20px;
      overflow: hidden;
      .tag:last-child {
        margin-bottom: 0;
      }
    }
    .info {
      display: flex;
      align-items: center;
      cursor: pointer;
      line-height: 1.25;
      .icon {
        color: #979797;
        transition: all .4s;
        &.expand {
          transform: rotateZ(90deg);
        }
      }
      &:hover, &.active {
        color: @link-color;
        .icon {
          color: @link-color;
        }
      }
      .tag-name {
        flex: 1;
      }
    }
  }
}
</style>
