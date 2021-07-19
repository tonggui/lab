<template>
  <with-search
    :arrow="true"
    :value="multiple ? paths : idPath"
    :name="multiple ? '' : name"
    :source="source"
    :disabled="disabled"
    :multiple="multiple"
    :maxCount="maxCount"
    :placeholder="placeholder"
    :separator="separator"
    :debounce="debounce"
    :width="width"
    :triggerMode="triggerMode"
    :onSearch="handleSearch"
    :transfer="transfer"
    @change="handleChange"
    @open="$emit('start')"
    @focus="handleFocus"
    @blur="handleBlur"
    @close="handleClose"
    v-bind="$attrs"
  />
</template>

<script>
  import WithSearch from '../cascader/with-search'
  import { getPathById, searchPath } from './util'
  import TimeCounters from '@/common/lx/lxReport/lxTime'
  /**
   * event {change}
   */
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
      },
      triggerMode: {
        validator: val => ['click', 'hover'].indexOf(val) > -1,
        default: 'click'
      },
      transfer: Boolean
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
      handleFocus () {
        TimeCounters.setTime('tag', Date.now(), 's2e')
        this.$emit('focus')
      },
      handleBlur () {
        TimeCounters.setEndTime('tag', Date.now())
        this.$emit('blur')
      },
      handleClose () {
        TimeCounters.stopTime('tag')
        this.$emit('end')
      },
      arrange () {
        const multiple = this.maxCount > 1
        if (!this.source || this.source.length < 1) return
        if (
          multiple &&
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
      handleSearch ({ keyword }) {
        if (!keyword) return Promise.resolve([])
        const result = searchPath(keyword, this.source)
        const searchResult = result.map(path => ({
          id: path[path.length - 1].id,
          name: path.map(v => v.name).join(this.separator),
          path,
          isLeaf: true
        }))
        return Promise.resolve({
          data: searchResult,
          total: searchResult.length
        })
      },
      handleChange (...args) {
        const multiple = this.maxCount > 1
        if (multiple) {
          const [newPaths] = args
          this.paths = newPaths
          TimeCounters.setEndTime('tag', Date.now())
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
          TimeCounters.setEndTime('tag', Date.now())
          this.$emit('change', newVal)
        }
      }
    },
    components: {
      WithSearch
    }
  }
</script>
<style scoped>
.tagList {
  position: relative;
}
</style>
