<template>
  <ErrorBoundary :error="error" @refresh="getData" description="分类获取失败～">
    <TagList
      :sorting="sorting"
      :showSort="false"
      :productCount="productCount"
      :tagList="dataSource"
      :tagId="tagId"
      :loading="loading"
      labelInValue
      @change-level-tag="handleChangeLevel"
      @edit-tag="handleEdit"
      @add-tag="handleAdd"
      @delete-tag="handleDelete"
      @change-list="handleChangeTagList"
      @open-sort="$emit('open-sort')"
      @select="$listeners.select"
    />
  </ErrorBoundary>
</template>
<script>
  import TagList from '@/views/components/tag-list'
  import {
    fetchGetSortedTagList,
    fetchSubmitChangeTagLevel,
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
          console.error(err)
          this.$Message.error(err.message || err)
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
          cb && cb()
          // 删除的是当前选中的tag时，切回到全部商品
          if (tag.id === this.currentTag.id || tag.id === this.currentTag.parentId) {
            this.$emit('select', allProductTag)
          }
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
          // 如果有tag变成 当前 选中的 tag的子分类的时候，当前分类就不是叶子了，无法再选中，需要trigger到子分类上
          if (this.tagId === tag.parentId) {
            this.$emit('select', tag)
          }
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
          // 如果当前 选择的 分类是新增分类非父id，那么新增完了，当前选择分类就不是叶子分类，就不可以是选中，要切换到儿子节点
          if (this.tagId !== allProductTag.id && this.tagId === tag.parentId) {
            if (id !== this.tagId) {
              this.$emit('select', { ...tag, id })
            }
          }
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
