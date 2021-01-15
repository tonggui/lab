<template>
  <div class="nav-actions">
    <span v-if="isCorrect" @click="handleCorrectDisplay">标品纠错 ></span>
    <span v-if="isDisplay" @click="handleDetailDisplay">查看标品 ></span>
  </div>
</template>
<script>
  import lx from '@/common/lx/lxReport'
  export default {
    name: 'nav-actions',
    props: {
      productData: {
        type: Object,
        required: true,
        default: () => {}
      },
      allowCorrectSp: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isCorrect () {
        const isCorrect = this.productData.recoverySymbol === 1 && this.allowCorrectSp
        if (isCorrect) {
          lx.mv({ bid: 'b_shangou_online_e_dd3ktgge_mv' })
        }
        return isCorrect
      },
      isDisplay () {
        const isDisplay = this.productData.detailSymbol === 1 && this.productData.recoverySymbol === 0 && this.allowCorrectSp
        if (isDisplay) {
          lx.mv({ bid: 'b_shangou_online_e_zdz91r3t_mv' })
        }
        return isDisplay
      }
    },
    methods: {
      handleCorrectDisplay () {
        lx.mc({ bid: 'b_shangou_online_e_zdz91r3t_mc' })
        this.$router.replace({ name: 'spCorrect', query: { ...this.$route.query, upc: this.productData.upcCode, type: 'correct' } })
      },
      handleDetailDisplay () {
        lx.mc({ bid: 'b_shangou_online_e_ctw618b9_mc' })
        this.$router.replace({ name: 'spCorrect', query: { ...this.$route.query, upc: this.productData.upcCode, type: 'detail' } })
      }
    }
  }
</script>
<style lang="less" scoped>
  .nav-actions {
    position: absolute;
    color: @link-color;
    top: 15px;
    right: 10px;
    z-index: 1000;
    > span {
      &:not(:last-child) {
        margin-right: 10px;
      }
      cursor: pointer;
    }
  }
</style>
