<template>
  <div class="sp-table-op-cell">
    <span v-if="isDisplay" @click="handleDetailDisplay">查看</span>
    <span v-if="isCorrect" @click="handleCorrectDisplay">纠错</span>
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
      }
    },
    methods: {
      handleCorrectDisplay () {
        lx.mc({ bid: 'b_shangou_online_e_r5etiq80_mc' })
        this.$router.push({ name: 'spCorrect', query: { ...this.$route.query, spId: this.product.id, type: 'correct' } })
      },
      handleDetailDisplay () {
        lx.mc({ bid: 'b_shangou_online_e_ebz5xvko_mc' })
        this.$router.push({ name: 'spCorrect', query: { ...this.$route.query, spId: this.product.id, type: 'detail' } })
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
