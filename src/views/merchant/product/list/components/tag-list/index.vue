<template>
  <TagList
    :sorting="sorting"
    :productCount="productCount"
    :tagList="tagList"
    :sortTagList="sortTagList"
    :tagId="tagId"
    :loading="loading"
    labelInValue
    @edit-tag="handleEdit"
    @add-tag="handleAdd"
    @change-list="handleChangeTagList"
    @open-sort="$emit('open-sort')"
    @select="$listeners.select"
    @delete-tag="handleDelete"
  />
</template>
<script>
  import TagList from '@/views/components/tag-list'
  // TODO 增删改查
  import {
    fetchGetTagList,
    fetchSubmitAddTag,
    fetchSubmitModTag,
    fetchSubmitDeleteTag
  } from '@/data/repos/merchantCategory'
  import {
    allProductTag
  } from '@/data/constants/poi'
  import store from '../../store'

  export default {
    name: 'merchant-product-list-tag',
    props: {
      sorting: {
        type: Boolean,
        default: false
      },
      currentTag: Object
    },
    data () {
      return {
        loading: false,
        error: false,
        tagList: [],
        productCount: 0
      }
    },
    watch: {
      sorting (sorting) {
        if (sorting) {
          store.sortTagList = this.tagList.slice()
        }
      }
    },
    computed: {
      tagId () {
        return this.currentTag.id
      },
      sortTagList () {
        return store.sortTagList
      }
    },
    components: {
      TagList
    },
    methods: {
      async getData () {
        try {
          this.loading = true
          const { tagList, tagInfo } = await fetchGetTagList()
          const { productTotal } = tagInfo
          // TODO
          this.productCount = productTotal
          this.tagList = tagList
          this.error = false
        } catch (err) {
          this.error = true
        } finally {
          this.loading = false
        }
      },
      handleChangeTagList (tagList) {
        if (this.sorting) {
          store.sortTagList = tagList
          return
        }
        this.tagList = tagList
      },
      async handleDelete (tag, type, cb) {
        await fetchSubmitDeleteTag(tag, type)
        cb()
        if (tag.id === this.currentTag.id || tag.id === this.currentTag.parentId) {
          this.$emit('select', allProductTag)
        }
        this.getData()
      },
      async handleEdit (tag, type, cb) {
        await fetchSubmitModTag(tag, type)
        cb()
      },
      async handleAdd (tag, cb) {
        const id = await fetchSubmitAddTag(tag)
        return cb(id)
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
