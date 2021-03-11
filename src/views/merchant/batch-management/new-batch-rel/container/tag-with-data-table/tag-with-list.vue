<template>
  <div class="tag-with-list-container">
    <TagTreeWithCheckBox
      :loading="loading"
      :dataSource="dataSource"
      :expandList="expandList"
      :productCount="productCount"
      showAllData
      label-in-value
    />
  </div>
</template>

<script>
  import TagTreeWithCheckBox from '@components/tag-tree-with-checkbox'
  import { helper } from '../../store'

  const { mapGetters, mapState } = helper('recommendList/tagList')

  export default {
    name: 'tag-with-list',
    components: {
      TagTreeWithCheckBox
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapState(['productCount', 'expandList', 'loading', 'error']),
      ...mapGetters({
        tagList: 'list'
      }),
      dataSource () {
        console.log('this.', this.tagList)
        return this.tagList
      }
    }
  }
</script>

<style lang="less" scoped>
  .tag-with-list-container {
    width: 158px;
    overflow-y: auto;
    border: 1px solid #EEEEEE;
    border-right: none;
  }
</style>
