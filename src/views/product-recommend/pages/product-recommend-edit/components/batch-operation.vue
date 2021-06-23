<template>
  <div class="product-recommend-edit-batch-operation">
    <div>
      <Checkbox @on-change="handleSelectAll" :value="value" :indeterminate="!value && indeterminate" >全选本页</Checkbox>
    </div>
    <div>
      <span class="batch-delete" :class="{ disabled }" @click="handleDelete">批量删除</span>
      <Button type="primary">批量创建</Button>
      <span></span>
      <!-- <Button type="primary" :disabled="disabled" @click="handleCreate">
        确认创建
        <span v-if="!disabled">({{ count }})</span>
      </Button> -->
    </div>
  </div>
</template>
<script>
  export default {
    name: 'product-recommend-edit-batch-operation',
    props: {
      value: Boolean,
      indeterminate: Boolean,
      count: Number
    },
    computed: {
      disabled () {
        return this.count <= 0
      }
    },
    methods: {
      handleSelectAll (selected) {
        this.$emit('select-all', selected)
      },
      handleCreate () {
        this.$emit('create')
      },
      handleDelete () {
        if (this.disabled) return
        this.$emit('delete')
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-recommend-edit-batch-operation {
    display: flex;
    padding: 18px;
    justify-content: space-between;
    vertical-align: middle;
    border-top: 1px solid @border-color-base;
    .batch-delete {
      margin-right: 16px;
      cursor: pointer;
      user-select: none;
      &:not(.disabled) {
        text-decoration: underline;
      }
      &.disabled {
        color: #CCCCCC;
        cursor: not-allowed;
      }
    }
  }
</style>
