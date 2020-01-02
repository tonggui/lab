<template>
  <SortTagList
    labelInValue
    :show-smart-sort="false"
    :loading="loading"
    :tag-list="tagList"
    :expand-list="expandList"
    :tag-id="tagId"
    @change="handleSort"
    @select="handleSelect"
    @expand="handleExpand"
  />
</template>
<script>
  import SortTagList from '@/views/components/sort-tag-list' // 分类排序
  import { helper } from '../../store'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  const { mapGetters, mapActions, mapState } = helper('tagList')

  export default {
    name: 'merchant-product-sort-tag-list-container',
    computed: {
      ...mapState(['expandList', 'loading']),
      ...mapGetters({
        tagId: 'currentTagId',
        tagList: 'list'
      })
    },
    components: {
      SortTagList: withPromiseEmit(SortTagList)
    },
    methods: {
      ...mapActions({
        handleExpand: 'expand',
        select: 'select',
        sort: 'sort'
      }),
      handleSort (tagList, tag, sortList) {
        return this.sort({ tagList, tag, sortList })
      },
      handleSelect (tag) {
        const callback = () => this.select(tag)
        if (this.$listeners['before-select']) {
          this.$emit('before-select', callback)
        } else {
          callback()
        }
      }
    }
  }
</script>
