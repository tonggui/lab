<template>
  <TagList
    :sorting="sorting"
    :showSort="false"
    :productCount="productCount"
    :tagList="dataSource"
    :tagId="tagId"
    :loading="loading"
    labelInValue
    @edit-tag="handleEdit"
    @add-tag="handleAdd"
    @delete-tag="handleDelete"
    @change-list="handleChangeTagList"
    @open-sort="$emit('open-sort')"
    @select="$listeners.select"
  />
</template>
<script>
  import TagList from '@/views/components/tag-list'
  import {
    fetchGetSortedTagList,
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
          store.sortTagList = this.cloneTagList(this.tagList)
        }
      }
    },
    computed: {
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
          const { tagList, tagInfo } = await fetchGetSortedTagList()
          const { productTotal } = tagInfo
          this.productCount = productTotal
          this.tagList = tagList
          this.error = false
        } catch (err) {
          this.error = true
        } finally {
          this.loading = false
        }
      },
      cloneTagList (list) {
        return list.map(node => {
          if (node.isLeaf) {
            return node
          }
          return {
            ...node,
            children: this.cloneTagList(node.children)
          }
        })
      },
      handleChangeTagList (tagList) {
        if (this.sorting) {
          store.sortTagList = tagList
          return
        }
        this.tagList = tagList
      },
      async handleDelete (tag, type, cb) {
        try {
          await fetchSubmitDeleteTag(tag.id, type)
          console.log('handleDelete:', cb)
          cb && cb()
          // 删除的是当前选中的tag时，切回到全部商品
          if (tag.id === this.currentTag.id || tag.id === this.currentTag.parentId) {
            this.$emit('select', allProductTag)
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
          this.getData()
        } catch (err) {
          this.$Message.error(err.message || err)
        }
      },
      async handleAdd (tag, cb) {
        try {
          const id = await fetchSubmitAddTag(tag)
          cb(id)
          // 如果当前 选择的 分类是新增分类非父id，那么新增完了，当前选择分类就不是叶子分类，就不可以是选中，要切换到儿子节点
          if (this.tagId !== allProductTag.id && this.tagId === tag.parentId) {
            if (id !== this.tagId) {
              this.$emit('select', { ...tag, id })
            }
          }
          this.getData()
        } catch (err) {
          this.$Message.error(err.message || err)
        }
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
