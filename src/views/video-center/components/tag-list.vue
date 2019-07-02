<template>
  <tag-tree
    :value="tagId"
    :dataSource="tagList"
    :expand-list="expandList"
    @select="handleSelect"
    @expand="handleExpand"
    :labelInValue="true"
  >
    <template v-slot:node="{ item, opened, actived }">
      <div class="info" :class="{active: actived}" :style="{paddingLeft: item.level > 0 ? '20px' : '0px'}">
        <span class="tag-name">{{ item.name }}</span>
        <Icon
          class="icon"
          :class="{ expand: opened }"
          type="navigate-next" size="16"
          v-if="!item.isLeaf"
        />
      </div>
    </template>
  </tag-tree>
</template>

<script>
import TagTree from '@components/tag-tree'
export default {
  name: 'related-product-tag-list',
  props: {
    tagList: {
      type: Array,
      default () {
        return []
      }
    },
    tagId: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      expandList: []
    }
  },
  components: {
    TagTree
  },
  methods: {
    handleSelect (id) {
      this.$emit('change', id)
    },
    handleExpand (idList) {
      this.expandList = idList
    }
  }
}
</script>

<style lang="less" scoped>
.info {
  padding: 10px 0;
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
</style>
