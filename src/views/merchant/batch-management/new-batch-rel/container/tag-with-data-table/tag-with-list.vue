<template>
  <div class="tag-with-list-container">
    <TagTreeWithCheckBox
      :loading="loading"
      :dataSource="dataSource"
      :expandList="expandList"
      :productCount="productCount"
      :checkBoxList="checkBoxList"
      showAllData
      label-in-value
      @select="handleSelect"
      @on-checkbox-change="handleCheckBoxChange"
    />
  </div>
</template>

<script>
  import TagTreeWithCheckBox from '@components/tag-tree-with-checkbox'
  import { helper } from '../../store'

  const { mapGetters, mapState } = helper('recommendList/tagList')

  export default {
    name: 'tag-with-list',
    props: {
      checkBoxList: Object
    },
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
    },
    methods: {
      handleCheckBoxChange (checkBoxList) {
        console.log('checkBoxList', checkBoxList)
        this.$emit('on-checkbox-change', checkBoxList)
      },
      handleSelect (tag) {
        this.$emit('on-select', tag)
      }
    }
  }
</script>

<style lang="less" scoped>
  .tag-with-list-container {
    width: 158px;
    overflow-y: auto;
    border: 1px solid #EEEEEE;
    border-left: none;
    border-right: none;
  }
</style>
