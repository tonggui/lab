<template>
  <div>
    <EditCheckboxGroup v-for="(data, index) in dataSource" :key="data.id"
      :dataSource="data.options"
      :value="value[data.id]"
      :label="data.name"
      :required="data.required"
      :errorTips="errorTips"
      :generateItem="createItem"
      :valueKey="valueKey"
      :index="index"
      @on-change="handleChange"
      ref="item"
    />
  </div>
</template>
<script>
  import EditCheckboxGroup from './edit-checkbox-group'

  export default {
    name: 'sell-info-attr-list',
    props: {
      dataSource: {
        type: Array,
        default: () => []
      },
      value: {
        type: Object,
        default: () => ({})
      },
      valueKey: {
        type: String,
        default: 'id'
      },
      errorTips: {
        type: String,
        default: ''
      },
      generateItem: {
        type: Function,
        required: true
      }
    },
    components: {
      EditCheckboxGroup
    },
    methods: {
      createItem (index, name, order) {
        const parent = this.dataSource[index]
        return this.generateItem(parent, name, order)
      },
      handleChange (options, selectedList, index) {
        const dataSource = [...this.dataSource]
        const value = { ...this.value }
        const node = dataSource[index]
        dataSource.splice(index, 1, {
          ...node,
          options
        })
        value[node.id] = selectedList
        this.$emit('on-change', dataSource, value)
      },
      validator () {
        const $itemList = this.$refs.item
        for (let i = 0, l = $itemList; i < l; i++) {
          const node = $itemList[i]
          if (node && node.validator) {
            const error = node.validator()
            if (error) {
              return error
            }
          }
        }
        return false
      }
    }
  }
</script>
