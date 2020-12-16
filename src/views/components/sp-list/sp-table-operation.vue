<template>
  <div class="sp-table-op-cell">
    <span>
      <router-link class="active" :to="detailPage">查看</router-link>
    </span>
    <span v-if="isShow" @click="handleVisible">
      纠错
    </span>
  </div>
</template>
 <script>
  export default {
    name: 'sp-table-operation',
    props: {
      product: {
        type: Object,
        required: true,
        default: () => ({})
      }
    },
    data () {
      return {
        isModalShow: false
      }
    },
    computed: {
      isShow () {
        // return this.product.recoverySymbol === '1'
        return true
      },
      detailPage () {
        return {
          name: 'spDetail',
          query: { ...this.$route.query, spId: this.product.id }
        }
      }
    },
    methods: {
      handleVisible () {
        this.$emit('handleModal', this.product)
      }
    }
  }
 </script>
 <style lang="less" scoped>
  .sp-table-op-cell {
    color: @link-color;
    text-align: center;
    > span {
      &:not(:last-child) {
        margin-right: 10px;
      }
      cursor: pointer;
    }
  }
</style>
