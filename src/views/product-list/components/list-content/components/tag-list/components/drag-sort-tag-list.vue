<template>
  <TagTree
    :value="tagId"
    :dataSource="dataSource"
    @select="$listeners.change"
    @expand="$listeners.expand"
    :expandList="expandList"
    :list-tag="draggable"
    :component-data="getDraggableData()"
  >
    <template v-slot:node-extra="{item, index}">
      <span class="drag-sort-icon handle">
        <Icon type="unfold-more" size=14></Icon>
      </span>
    </template>
  </TagTree>
</template>
<script>
import Vue from 'vue'
import Draggable from 'vuedraggable'
import TagTree from '@components/tag-tree'
import store from '@/views/product-list/store'

Vue.component(Draggable.name, Draggable)

export default {
  name: 'drag-sort-tag-list',
  props: {
    tagList: {
      type: Array,
      default: () => []
    },
    tagId: Number,
    expandList: Array
  },
  data () {
    store.dragTagList = this.initData(this.tagList)
    return {
      dataSource: store.dragTagList
    }
  },
  computed: {
    draggable () {
      return Draggable.name
    }
  },
  watch: {
    tagList (newValue) {
      store.dragTagList = this.initData(newValue)
    }
  },
  components: {
    TagTree
  },
  methods: {
    getDraggableData () {
      return {
        attrs: {
          handle: '.handle',
          animation: 200,
          ghostClass: 'tag-tree-ghost'
        },
        directives: [
          {
            name: 'model',
            value: this.dataSource
          }
        ]
      }
    },
    initData (list) {
      return list.map(tag => {
        const node = { ...tag }
        if (!tag.isLeaf) {
          node.children = this.initData(node.children)
        }
        return node
      })
    }
  }
}
</script>
<style lang="less" scoped>
.drag-sort-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 12px;
  border: 1px solid rgba(248,152,0,0.30);
  border-radius: 100%;
  text-align: center;
  color: @highlight-color;
  cursor: move;
  i {
    transform: scale(.8);
  }
}
</style>
<style lang="less">
.tag-tree-ghost {
  opacity: 0.5;
}
</style>
