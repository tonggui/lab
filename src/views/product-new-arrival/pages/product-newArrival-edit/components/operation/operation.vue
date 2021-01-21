<template>
  <div class="product-recommend-edit-table-operation">
    <Button type="primary" @click="handleCreate" :disabled="disabled" :loading="submitting">上架</Button>
    <span class="operation-delete" :class="{ deleting }" @click="handleDelete">
      <Icon type="loading" v-if="deleting" />删除
    </span>
  </div>
</template>
<script>
  import { isIncompleteProductInfo } from '@/views/product-recommend/utils'

  export default {
    name: 'product-recommend-edit-table-operation',
    props: {
      product: {
        type: Object,
        required: true
      },
      createCallback: {
        type: Function,
        default: (success) => success
      },
      isIncompleteCheck: {
        type: Function,
        default: isIncompleteProductInfo
      }
    },
    data () {
      return {
        submitting: false,
        deleting: false
      }
    },
    computed: {
      disabled () {
        return this.isIncompleteCheck(this.product)
      }
    },
    methods: {
      handleCreate () {
        if (this.submitting) {
          return
        }
        this.submitting = true
        const callback = () => { this.submitting = false }
        this.$emit('create', this.product, this.createCallback(callback, (err) => {
          console.error(err)
          callback()
        }))
      },
      handleDelete () {
        if (this.deleting) {
          return
        }
        this.deleting = true
        const callback = () => { this.deleting = false }
        this.$emit('delete', this.product, this.createCallback(callback, (err) => {
          console.error(err)
          callback()
        }))
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-recommend-edit-table-operation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    white-space: nowrap;
    .operation-delete {
      text-decoration: underline;
      cursor: pointer;
      margin-left: 10px;
    }
  }
</style>
