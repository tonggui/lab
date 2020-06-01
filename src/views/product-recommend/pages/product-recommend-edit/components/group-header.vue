<template>
  <div class="product-recommend-edit-group-header">
    <Checkbox v-bind="status" @on-change="handleSelectAll">
      {{ group.name }}
      <span v-show="count > 0">({{ count }})</span>
    </Checkbox>
  </div>
</template>
<script>
  export default {
    name: 'product-recommend-edit-group-header',
    props: {
      group: {
        type: Object,
        validator: (group) => {
          return ['id', 'name', 'list'].every((key) => key in group)
        },
        required: true
      },
      selectedIdList: {
        type: Array,
        required: true
      }
    },
    computed: {
      count () {
        const { list } = this.group
        let count = 0
        list.forEach(product => {
          if (this.selectedIdList.includes(product.__id__)) {
            count += 1
          }
        })
        return count
      },
      status () {
        const value = this.count >= this.group.list.length
        const indeterminate = !value && this.count > 0
        return {
          value,
          indeterminate
        }
      }
    },
    methods: {
      handleSelectAll (selected) {
        this.$emit('select-all', selected, this.group.list)
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-recommend-edit-group-header {
    border-bottom: 1px solid @border-color-base;
    padding: 10px 18px;
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
  }
</style>
