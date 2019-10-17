<template>
  <TagTree
    class="drag-sort-tag-list"
    :labelInValue="labelInValue"
    :value="tagId"
    :dataSource="tagList"
    :showTopTime="false"
    @select="$listeners.select"
    @expand="$listeners.expand"
    :expandList="expandList"
    :draggable="true"
    draggable-handle=".handle"
    @sort="handleSort"
    transition-name=""
  >
    <template v-slot:node-extra="{item, index}">
      <span class="drag-sort-icon handle" v-if="!item.isUnCategorized">
        <Icon local="drag" size=18></Icon>
      </span>
    </template>
  </TagTree>
</template>
<script>
  import TagTree from '@components/tag-tree'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'drag-sort-tag-list',
    props: {
      labelInValue: Boolean,
      tagList: {
        type: Array,
        default: () => []
      },
      tagId: Number,
      expandList: Array
    },
    components: {
      TagTree
    },
    methods: {
      handleSort (list, tag, sortList) {
        lx.mc({ bid: 'b_shangou_online_e_x5yb9btj_mc' })
        this.$emit('change', list, tag, sortList)
      }
    }
  }
</script>
