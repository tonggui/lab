<template>
  <TagList
    :sorting="sorting"
    :smartSortSwitch="smartSortSwitch"
    :topLimit="topLimit"
    :productCount="productCount"
    :tagList="dataSource"
    :tagId="tagId"
    :loading="loading"
    labelInValue
    showSmartSort
    @edit-tag="handleEdit"
    @add-tag="handleAdd"
    @delete-tag="handleDelete"
    @change-list="handleChangeTagList"
    @toggle-smart-sort="handleToggleSmartSort"
    @open-sort="$emit('open-sort')"
    @select="$listeners.select"
  />
</template>
<script>
  import TagList from '@/views/components/tag-list'
  import {
    fetchGetPoiTagInfo,
    fetchSubmitAddTag,
    fetchSubmitModTag,
    fetchSubmitDeleteTag
  } from '@/data/repos/category'
  import {
    allProductTag
  } from '@/data/constants/poi'
  import store from '../../store'

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
        smartSortSwitch: false
      }
    },
    watch: {
      smartSortSwitch () {
        store.sortTagList = this.cloneTagList(this.tagList)
      },
      sorting (sorting) {
        if (sorting) {
          store.sortTagList = this.cloneTagList(this.tagList)
        }
      }
    },
    computed: {
      productCount () {
        return store.poiProductCount
      },
      tagId () {
        return this.currentTag.id
      },
      sortTagList () {
        return store.sortTagList
      },
      dataSource () {
        return this.sorting ? this.sortTagList : this.tagList
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
          store.productCount = productTotal
          store.isEmptyTag = tagList.length <= 0
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
      handleToggleSmartSort (value) {
        this.smartSortSwitch = value
      },
      async handleDelete (tag, type, cb) {
        try {
          await fetchSubmitDeleteTag(tag, type)
          cb()
          // 删除的是当前选中的tag时，切回到全部商品
          if (tag.id === this.currentTag.id || tag.id === this.currentTag.parentId) {
            this.$emit('select', allProductTag)
            return
          }
          this.getData()
        } catch (err) {
          this.$Message.error(err.message || err)
        }
      },
      async handleEdit (tag, type, cb) {
        try {
          await fetchSubmitModTag(tag, type)
          cb()
        } catch (err) {
          this.$Message.error(err.message || err)
        }
      },
      async handleAdd (tag, cb) {
        try {
          const id = await fetchSubmitAddTag(tag)
          cb(id)
        } catch (err) {
          this.$Message.error(err.message || err)
        }
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
