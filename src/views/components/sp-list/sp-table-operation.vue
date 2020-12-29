<template>
  <div class="sp-table-op-cell">
    <span v-if="isDisplay">
      <router-link class="active" :to="detailPage">查看</router-link>
    </span>
    <span v-if="isCorrect" @click="handleVisible">
      纠错
    </span>
  </div>
</template>
 <script>
  import lx from '@/common/lx/lxReport'
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
      isCorrect () {
        const correct = this.product.recoverySymbol === 1
        if (correct) {
          lx.mv({ bid: 'b_shangou_online_e_r5etiq80_mv' })
        }
        return correct
      },
      isDisplay () {
        const display = this.product.detailSymbol === 1
        if (display) {
          lx.mv({ bid: 'b_shangou_online_e_ebz5xvko_mv' })
        }
        return display
      },
      detailPage () {
        return {
          name: 'spCorrect',
          query: { ...this.$route.query, spId: this.product.id, type: 'detail' }
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
