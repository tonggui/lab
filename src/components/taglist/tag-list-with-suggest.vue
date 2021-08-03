<template>
  <div>
    <div class="tag-warning" v-if="needApplyWarning" v-show="!categoryTemplateApplying">
      <Icon type="error" :size="16" />
      <span style="margin:0 5px">{{ needApplyWarning }}</span>
      <a @click="$emit('showCategoryTemplate')" v-mc="{ bid: 'b_shangou_online_e_eiy4hej5_mc' }">查看分类模板 &gt;</a>
    </div>
    <with-suggest
      :value="categoryTemplateApplying ? [] : (multiple ? paths : idPath)"
      :suggestList="_suggestList"
      :name="(multiple || categoryTemplateApplying) ? '' : name"
      :source="source"
      :disabled="disabled || categoryTemplateApplying"
      :multiple="multiple"
      :maxCount="maxCount"
      :placeholder="categoryTemplateApplying ? '分类模板提交中...' : placeholder"
      :separator="separator"
      :debounce="debounce"
      :width="width"
      :onSearch="handleSearch"
      @change="handleChange"
      @open="$emit('start')"
      @close="$emit('end')"
      v-bind="$attrs"
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
      suggestList: {
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
      categoryTemplateApplying: {
        type: Boolean,
        default: false
      },
      needApplyWarning: {
        type: String,
        default: ''
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
      _suggestList () {
        const suggestList = []
        this.suggestList.forEach(sug => {
          const { id, idPath, namePath } = sug
          const path = getPathById(id, this.source)
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
          } else {
            suggestList.push({
              id,
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
      },
      _suggestList (v) {
        const empty = !this.value || !this.value.length // 当前没值
        if (empty && v && v.length) {
          const val = v.slice(0, this.multiple ? 5 : 1).map(v => {
            const name = v.name.split(this.separator).reduce((a, b) => b || a)
            return { id: v.id, name }
          })
          this.$emit('change', val)
        }
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
            newPaths.map(path => {
              const id = path.idPath[path.idPath.length - 1]
              return {
                id,
                name: path.namePath[path.namePath.length - 1],
                isRecommend: this._suggestList.some(it => it.id === id)
              }
            })
          )
        } else {
          const [idPath = [], namePath = []] = args
          this.idPath = idPath
          this.name = namePath.join(this.separator)
          const newVal = []
          if (idPath.length > 0) {
            const id = idPath[idPath.length - 1]
            newVal.push({
              id,
              name: namePath[namePath.length - 1],
              isRecommend: this._suggestList.some(it => it.id === id)
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
    margin-bottom: -2px;
  }
</style>
