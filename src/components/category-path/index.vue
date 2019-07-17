<template>
  <WithSearch
    arrow
    ref="withSearch"
    :value="val"
    :name="name"
    :source="fetchCategory"
    :disabled="disabled"
    :placeholder="placeholder"
    :debounce="debounce"
    :width="width"
    :triggerMode="triggerMode"
    :onSearch="handleSearch"
    @change="handleChange"
    @close="handleClose"
    @trigger="handleTrigger"
  >
    <!-- <template v-slot:renderItem>
    </template> -->
  </WithSearch>
</template>

<script>
  import WithSearch from '../cascader/with-search'
  import { fetchGetCategoryListByParentId, fetchGetCategoryByName } from '@/data/repos/category'

  export default {
    name: 'category-path',
    components: { WithSearch },
    props: {
      value: {
        type: Object,
        required: true
      },
      separator: {
        type: String,
        default: ' / '
      },
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      debounce: {
        type: Number,
        default: 400
      },
      width: {
        type: Number,
        default: 440
      },
      triggerMode: {
        type: String,
        default: 'hover'
      }
    },
    data () {
      return {
        categoryId: null,
        categoryName: ''
      }
    },
    computed: {
      // 传入withSearch组件的value，需要转换
      val () {
        return this.value.idPath || []
      },
      // 根据categoryNamePath和separator生成的展示名
      name () {
        return (this.value.namePath || []).join(this.separator)
      }
    },
    methods: {
      // 获取后台类目
      fetchCategory (parentId) {
        return fetchGetCategoryListByParentId(parentId).then(data => ({
          id: parentId,
          children: data,
          total: data.length
        }))
      },
      handleSearch ({ keyword }) {
        if (!keyword) return Promise.resolve([])
        return fetchGetCategoryByName(keyword).then((data) => {
          const result = data.map((item) => {
            const {
              id,
              idPath,
              namePath
            } = item
            const path = idPath.map((v, i) => ({
              id: v,
              name: namePath[i] || ''
            }))
            return {
              id,
              name: namePath.join(this.props.separator),
              path,
              leaf: true
            }
          })
          return { data: result, total: result.length }
        })
      },
      handleChange (idPath, namePath) {
        this.$emit('on-change', {
          id: idPath[idPath.length - 1] || null,
          idPath,
          name: namePath[namePath.length - 1] || '',
          namePath,
          isLeaf: true,
          level: idPath.length
        })
      },
      handleClose () {
        this.categoryId = null
      },
      handleTrigger (item) {
        const {
          id,
          name,
          leaf = true
        } = item
        this.categoryId = leaf ? id : null
        this.categoryName = name || ''
      }
    }
  }
</script>
