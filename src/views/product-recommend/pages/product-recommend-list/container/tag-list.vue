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
  import { helper } from '@/views/product-recommend/store'

  const { mapGetters, mapState, mapActions } = helper('tagList')

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
      ...mapActions({
        handleChangeTag: 'select'
      })
    }
  }
</script>
