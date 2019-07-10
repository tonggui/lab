<template>
  <TagTree
    :value="tagId"
    :dataSource="dataSource"
    :showTopTime="false"
    @select="$listeners.select"
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
    computed: {
      draggable () {
        return Draggable.name
      },
      dataSource: {
        get () {
          return this.tagList
        },
        set (list) {
          this.$emit('change', list)
        }
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
