<template>
  <div>
    <div class="tag-warning">
      <Icon type="error" :size="16" />
      <span style="margin:0 5px">检测到店内分类过少，建议使用分类模板，可提高商品曝光及转化</span>
      <a @click="$emit('showCategoryTemplate')">查看分类模板 &gt;</a>
    </div>
    <with-suggest
      :value="multiple ? paths : idPath"
      :suggestList="suggestList"
      :name="multiple ? '' : name"
      :source="source"
      :disabled="disabled"
      :multiple="multiple"
      :maxCount="maxCount"
      :placeholder="placeholder"
      :separator="separator"
      :debounce="debounce"
      :width="width"
      :onSearch="handleSearch"
      @change="handleChange"
    />
  </div>
</template>

<script>
  import WithSuggest from './with-suggest'
  import { getPathById, searchPath } from './util'

  export default {
    name: 'taglist',
    props: {
      source: {
        type: Array,
        required: true
      },
      value: {
        type: Array,
        default: () => []
      },
      suggestIdList: {
        type: Array,
        default: () => []
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
      maxCount: {
        type: Number,
        default: 1
      },
      debounce: {
        type: Number,
        default: 100
      },
      width: {
        type: Number,
        default: 440
      }
    },
    data () {
      return {
        paths: [],
        idPath: [],
        name: ''
      }
    },
    computed: {
      multiple () {
        return this.maxCount > 1
      },
      suggestList () {
        const suggestList = []
        this.suggestIdList.forEach(tagId => {
          const path = getPathById(tagId, this.source)
          if (path && path.length) {
            const idPath = path.map(v => v.id)
            const namePath = path.map(v => v.name)
            suggestList.push({
              id: idPath[idPath.length - 1],
              name: namePath.join(this.separator),
              idPath,
              namePath,
              isLeaf: true
            })
          }
        })
        return suggestList
      }
    },
    watch: {
      value: {
        immediate: true,
        handler () {
          this.arrange()
        }
      },
      source () {
        this.arrange()
      },
      maxCount () {
        this.arrange()
      }
    },
    methods: {
      arrange () {
        if (!this.source || this.source.length < 1) return
        if (
          this.multiple &&
          this.paths
            .map(path => path.idPath[path.idPath.length - 1])
            .toString() !== this.value.map(tag => tag.id).toString()
        ) {
          const newPaths = this.value
            .map(tag => {
              const newPath = getPathById(tag.id, this.source)
              const newIdPath = []
              const namePath = []
              newPath.forEach(({ id, name }) => {
                newIdPath.push(id)
                namePath.push(name)
              })
              return {
                idPath: newIdPath,
                namePath
              }
            })
            .filter(v => v.idPath.length > 0) // 过滤掉无效的tagId
          this.paths = newPaths
          if (this.value.length !== newPaths.length) {
            // value纠正
            this.$emit(
              'change',
              newPaths.map(path => ({
                id: path.idPath[path.idPath.length - 1],
                name: path.namePath[path.namePath.length - 1]
              }))
            )
          }
        } else {
          if (
            this.value.length > 0 &&
            this.value[0].id !== this.idPath[this.idPath.length - 1]
          ) {
            const newPath = getPathById(this.value[0].id, this.source)
            const newIdPath = []
            const namePath = []
            newPath.forEach(({ id, name }) => {
              newIdPath.push(id)
              namePath.push(name)
            })
            this.idPath = newIdPath
            this.name = namePath.join(this.separator)
            if (newIdPath.length < 1) {
              this.$emit('change', [])
            }
          } else if (this.value.length === 0 && this.idPath.length > 0) {
            this.idPath = []
            this.name = ''
          }
        }
      },
      handleSearch (keyword) {
        if (!keyword) return Promise.resolve([])
        const result = searchPath(keyword, this.source)
        const searchResult = result.map(path => {
          const idPath = path.map(v => v.id)
          const namePath = path.map(v => v.name)
          return {
            id: idPath[idPath.length - 1],
            name: namePath.join(this.separator),
            idPath,
            namePath,
            isLeaf: true
          }
        })
        return Promise.resolve(searchResult || [])
      },
      handleChange (...args) {
        const multiple = this.maxCount > 1
        if (multiple) {
          const [newPaths] = args
          this.paths = newPaths
          this.$emit(
            'change',
            newPaths.map(path => ({
              id: path.idPath[path.idPath.length - 1],
              name: path.namePath[path.namePath.length - 1]
            }))
          )
        } else {
          const [idPath = [], namePath = []] = args
          this.idPath = idPath
          this.name = namePath.join(this.separator)
          const newVal = []
          if (idPath.length > 0) {
            newVal.push({
              id: idPath[idPath.length - 1],
              name: namePath[namePath.length - 1]
            })
          }
          this.$emit('change', newVal)
        }
      }
    },
    components: {
      WithSuggest
    }
  }
</script>
<style lang="less" scoped>
  .tagList {
    position: relative;
  }
  .tag-warning {
    display: flex;
    align-items: center;
    font-size: @font-size-small;
    color: @error-color;
  }
</style>
