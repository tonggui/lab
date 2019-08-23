<template>
  <TagList
    :sorting="sorting"
    :smartSortSwitch="smartSortSwitch"
    :topLimit="topLimit"
    :productCount="productCount"
    :tagList="tagList"
    :tagId="tagId"
    :loading="loading"
    labelInValue
    showSmartSort
    @change-level-tag="handleChangeLevel"
    @edit-tag="handleEdit"
    @add-tag="handleAdd"
    @delete-tag="handleDelete"
    @sort="handleSortTagList"
    @toggle-smart-sort="handleToggleSmartSort"
    @open-sort="$emit('open-sort')"
    @select="$listeners.select"
  />
</template>
<script>
  import TagList from '@/views/components/tag-list'
  import {
    fetchGetPoiTagInfo,
    fetchSubmitChangeTagLevel,
    fetchSubmitAddTag,
    fetchSubmitModTag,
    fetchSubmitDeleteTag
  } from '@/data/repos/category'

  export default {
    name: 'product-list-tag',
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
        topLimit: 0,
        smartSortSwitch: false,
        productCount: 0
      }
    },
    computed: {
      tagId () {
        return this.currentTag.id
      }
    },
    components: {
      TagList
    },
    methods: {
      async getData () {
        try {
          this.loading = true
          const { tagList, tagInfo } = await fetchGetPoiTagInfo(true)
          const { smartSortSwitch, topLimit, productTotal } = tagInfo
          this.tagList = tagList
          this.topLimit = topLimit
          this.smartSortSwitch = smartSortSwitch
          this.poiProductCount = productTotal
          this.error = false
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
          this.error = true
        } finally {
          this.loading = false
        }
      },
      handleSortTagList (tagList) {
        this.tagList = tagList
      },
      handleToggleSmartSort (value) {
        this.smartSortSwitch = value
      },
      async handleDelete (tag, type, cb) {
        try {
          await fetchSubmitDeleteTag(tag, type)
          cb()
          this.getData()
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
        }
      },
      async handleEdit (tag, cb) {
        try {
          await fetchSubmitModTag(tag)
          cb && cb()
          this.getData()
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
        }
      },
      async handleChangeLevel (tag, cb) {
        try {
          await fetchSubmitChangeTagLevel(tag.id, tag.parentId)
          cb && cb()
          this.getData()
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
        }
      },
      async handleAdd (tag, cb) {
        try {
          const id = await fetchSubmitAddTag(tag)
          cb && cb(id)
          this.getData()
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
        }
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
