<template>
  <div class="cascader border">
    <template v-for="(menu, index) in menuList">
      <Menu
        v-if="menu.children && menu.children.length"
        :key="menu.id"
        :list="menu.children"
        :total="menu.total || 0"
        :level="index + 1"
        :active="activeList"
        :exist="exist"
        :loadingId="loadingId"
        :triggerMode="triggerMode"
        :multiple="multiple"
        @trigger="handleTrigger"
      >
        <template v-slot:renderItem="props" v-if="$scopedSlots.renderItem">
          <slot
            name="renderItem"
            :item="props.item"
            :keyword="props.keyword"
            :highlight="props.highlight"
          ></slot>
        </template>
      </Menu>
    </template>
  </div>
</template>

<script>
import isFunction from 'lodash/isFunction'
import Menu from './menu'
/**
 * event {change, loading-id-change, trigger}
 */
export default {
  name: 'cascader',
  props: {
    value: {
      required: true,
      type: Array
    },
    exist: {
      type: Array,
      default: () => []
    },
    loadingId: {
      type: [Number, String],
      default: -1
    },
    source: {
      type: [Object, Array, Function],
      default: null
    },
    triggerMode: {
      validator: val => ['click', 'hover'].indexOf(val) > -1,
      default: 'click'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    allowBranchSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      menuList: []
    }
  },
  mounted () {
    this.updateSource()
  },
  watch: {
    source () {
      this.updateSource()
    },
    value () {
      if (!this.multiple) {
        this.adjust()
      }
    }
  },
  methods: {
    async adjust (value = this.value) {
      const newMenuList = this.menuList.slice(0, 1)
      if (this.multiple || value.length === 0) {
        this.menuList = newMenuList
      } else {
        // 如果当前状态正好跟当前值一样则忽略
        if (
          this.menuList
            .slice(1)
            .map(v => v.id)
            .toString() === value.toString()
        ) { return }
        if (isFunction(this.source)) {
          // 加载当前已选项，最后一个是叶子节点，不需要调用接口了
          for (let i = 0; i < value.length - 1; i++) {
            const id = value[i]
            if (!id) break
            const data = await this.source(id)
            if (!data.children || data.children.length < 1) break
            // 从上个列表中找到该id对应的名称
            const list = newMenuList[i].children || []
            const item = list.find(v => v.id === id)
            if (!item) break
            data.name = item.name
            newMenuList[i + 1] = data
          }
        } else {
          let current = this.source
          for (let i = 0; i < value.length; i++) {
            const id = value[i]
            if (!current || current.length < 1) break
            const next = current.find(v => v.id === id)
            if (!next) break
            newMenuList[i + 1] = next
            current = next.children
          }
        }
        this.menuList = newMenuList
      }
    },
    updateSource () {
      const menuList = []
      // 获取level1的数据，如果source是方法，则调用方法获取数据
      // 如果source已经是数组，则代表数据已经是全部的，level1的数据就是source[0]
      if (isFunction(this.source)) {
        // 当前加载项
        this.$emit('loading-id-change', 0)
        Promise.resolve(this.source(0)).then(data => {
          this.$emit('loading-id-change', -1)
          data.name = '全部'
          menuList[0] = data
          this.menuList = menuList
          this.$nextTick(() => {
            this.adjust()
          })
        })
      } else {
        menuList[0] = {
          id: 0,
          name: '全部',
          children: this.source,
          total: this.source.length
        }
        this.menuList = menuList
        this.$nextTick(() => {
          this.adjust()
        })
      }
    },
    handleTrigger (item, hover) {
      const { id, name, children, level, total, leaf } = item
      let allowBranchSelect = this.allowBranchSelect
      // 点击的项在选中级联树中的话则忽略
      if (!id) return
      if (this.triggerMode !== 'hover') {
        allowBranchSelect = false
      }
      if (leaf) {
        this.$emit('loading-id-change', -1)
      }
      // 点击的项是否已存在
      const singleIncluded = leaf
        ? this.exist.includes(id)
        : this.menuList.some(menu => menu.id === id)
      const included = this.multiple
        ? this.value.some(v => v.idPath.includes(id))
        : singleIncluded
      const allowOnChange = leaf || (allowBranchSelect && !hover)
      // 已存在并且是单选则不进行操作
      if (included && !allowBranchSelect && !this.multiple && !hover) { return }
      // 已存在并且是叶子节点并且是multiple则删除此项
      if (included && allowOnChange && this.multiple && !hover) {
        const newVal = this.value.slice()
        const index = newVal.findIndex(v => v.idPath.includes(id))
        newVal.splice(index, 1)
        this.$emit('change', newVal)
        return
      }
      this.$emit('trigger', item, hover)
      if (leaf && hover) {
        this.menuList = this.menuList.slice(0, level).concat({
          id,
          name,
          children,
          total
        })
        return
      }
      // 如果不是已选的叶子节点则根据是否multiple分别操作
      const newMenuList = this.menuList.slice(0, level)
      // 如果数据来源是API并且此时选中的是非叶子节点才去调用API获取数据
      if (!leaf && isFunction(this.source) && !allowOnChange) {
        // 当前加载项
        this.$emit('loading-id-change', id)
        this.source(id).then(data => {
          // 如果这会儿的loadingId已经变了则不再赋值
          if (id !== this.loadingId) {
            return
          }
          this.$emit('loading-id-change', -1)
          // 添加名称信息
          data.name = name
          newMenuList.push(data)
          this.menuList = newMenuList
        })
      } else {
        newMenuList.push({
          id,
          name,
          children,
          total
        })
        if (allowOnChange) {
          const idPath = []
          const namePath = []
          newMenuList.slice(1).forEach(menu => {
            idPath.push(menu.id)
            namePath.push(menu.name)
          })
          if (this.multiple) {
            this.$emit(
              'change',
              this.value.concat({
                idPath,
                namePath
              })
            )
          } else {
            this.$emit('change', idPath, namePath)
          }
        }
        this.menuList = newMenuList
      }
    }
  },
  computed: {
    activeList () {
      return this.menuList.map(menu => menu.id)
    }
  },
  components: {
    Menu
  }
}
</script>

<style scoped>
.cascader {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #fff;
}
.border {
  margin-left: 1px;
  box-shadow: 0 0 6px rgba(0,0,0,.1);
}
</style>
