<template>
  <div>
    <TagList
      :tagList="tagList"
      :loading="loading"
      :tagId="tagId"
      :productCount="productCount"
      @select="handleChangeTag"
    />
  </div>
</template>
<script>
  import TagList from '../components/tag-list'
  import { helper } from '../../../store'

  const { mapGetters, mapState } = helper('multiCubeList/tagList')

  export default {
    components: { TagList },
    computed: {
      ...mapState(['productCount', 'loading']),
      ...mapGetters({
        tagId: 'currentTagId',
        tagList: 'list'
      })
    },
    methods: {
      handleChangeTag (tagId, parentId) {
        console.log(tagId, parentId)
        this.$emit('on-select', { tagId: tagId, parentId: parentId })
      }
    }
  }
</script>
