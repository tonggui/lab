<template>
  <div>
    <!-- 未分类始终置顶 -->
    <TagTree
      v-if="unCategorizedList.length > 0"
      :labelInValue="labelInValue"
      :value="tagId"
      :dataSource="unCategorizedList"
      :show-top-time="false"
      @select="$listeners.select"
    />
    <TagTree
      class="drag-sort-tag-list"
      :labelInValue="labelInValue"
      :value="tagId"
      :dataSource="dataSource"
      :show-top-time="false"
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
  </div>
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
    computed: {
      unCategorizedList () {
        return this.tagList.filter(item => item.isUnCategorized)
      },
      dataSource () {
        return this.tagList.filter(item => !item.isUnCategorized)
      }
    },
    components: {
      TagTree
    },
    methods: {
      handleSort (list, tag, sortList) {
        lx.mc({ bid: 'b_shangou_online_e_x5yb9btj_mc' })
        // 未分类位置不能动
        if (this.unCategorizedList.length > 0) {
          list = [...this.unCategorizedList, ...list]
          // 未分类不参与排序 去掉
          // if (tag.level === 0) {
          //   sortList = [...this.unCategorizedList, ...sortList]
          // }
        }
        this.$emit('change', list, tag, sortList)
      }
    }
  }
</script>
