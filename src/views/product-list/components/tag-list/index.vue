<template>
  <TagList
    :sorting="sorting"
    :smartSortSwitch="smartSortSwitch"
    :topLimit="topLimit"
    :productCount="productCount"
    :tagList="tagList"
    :sortTagList="sortTagList"
    :tagId="tagId"
    :loading="loading"
    showSmartSort
    @edit-tag="handleEdit"
    @add-tag="handleAdd"
    @change-list="handleChangeTagList"
    @toggle-smart-sort="handleToggleSmartSort"
    @open-sort="$emit('open-sort')"
    @select="$listeners.select"
    @delete-tag="handleDelete"
  />
</template>
<script>
  import TagList from '@/views/components/product-list/tag-list'
  import {
    fetchGetPoiTagInfo,
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
      tagId: Number
    },
    data () {
      return {
        loading: false,
        error: false,
        tagList: [],
        sortTagList: [],
        productCount: 0,
        topLimit: 0,
        smartSortSwitch: false
      }
    },
    watch: {
      smartSortSwitch () {
        this.sortTagList = this.cloneTagList(this.tagList)
      },
      sorting (sorting) {
        if (sorting) {
          this.sortTagList = this.cloneTagList(this.tagList)
        }
      }
    },
    components: {
      TagList
    },
    methods: {
      async getData () {
        this.loading = true
        try {
          const { tagList, tagInfo } = await fetchGetPoiTagInfo(true)
          const { smartSortSwitch, topLimit, productTotal } = tagInfo
          // TODO
          this.productCount = productTotal
          this.tagList = tagList
          this.topLimit = topLimit
          this.smartSortSwitch = smartSortSwitch
          this.error = false
        } catch (err) {
          this.error = true
        } finally {
          this.loading = false
        }
      },
      handleChangeTagList (tagList) {
        if (this.sorting) {
          this.sortTagList = tagList
          return
        }
        this.tagList = tagList
      },
      handleToggleSmartSort (value) {
        this.smartSortSwitch = value
      },
      async handleDelete (tag, type) {
        await fetchSubmitDeleteTag(tag, type)
        this.getData()
      },
      async handleEdit (tag, type) {
        await fetchSubmitModTag(tag, type)
      },
      async handleAdd (tag) {
        const id = await fetchSubmitAddTag(tag)
        return id
      },
      cloneTagList (list) {
        return list.map(tag => {
          if (tag.isLeaf) {
            return tag
          }
          return {
            ...tag,
            children: this.cloneTagList(tag.children)
          }
        })
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
