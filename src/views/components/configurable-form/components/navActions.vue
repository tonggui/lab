<template>
  <div class="nav-actions">
    <span v-if="isCorrect" @click="handleCorrectVisible">标品纠错 ></span>
    <span v-if="isDisplay" @click="handleDetailDisplay">查看标品 ></span>
    <SpCorrectModal
      :visible="isCorrectVisible"
      :url="url"
      @confirm="handleCorrectConfirm"
      @cancel="handleCorrectCancel"
    />
  </div>
</template>
<script>
  import SpCorrectModal from '@/views/components/sp-list/sp-correct-modal'
  import { PRODUCT_CORRECT_IFRAME_URL } from '@/data/constants/product'
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
    components: {
      SpCorrectModal
    },
    data () {
      return {
        isCorrectVisible: false,
        url: PRODUCT_CORRECT_IFRAME_URL
      }
    },
    computed: {
      isCorrect () {
        const isCorrect = this.productData.recoverySymbol === '0' && this.allowCorrectSp
        if (isCorrect) {
          lx.mv({ bid: 'b_shangou_online_e_dd3ktgge_mv' })
        }
        return isCorrect
      },
      isDisplay () {
        const isDisplay = this.productData.detailSymbol === '1' && this.productData.recoverySymbol === '0' && this.allowCorrectSp
        if (isDisplay) {
          lx.mv({ bid: 'b_shangou_online_e_zdz91r3t_mv' })
        }
        return isDisplay
      }
    },
    methods: {
      handleCorrectVisible () {
        this.isCorrectVisible = true
      },
      handleCorrectConfirm () {
        lx.mc({ bid: 'b_shangou_online_e_zdz91r3t_mc' })
        this.isCorrectVisible = false
        this.$router.replace({ name: 'spCorrect', query: { ...this.$route.query, spId: this.productData.id } })
      },
      handleCorrectCancel () {
        this.isCorrectVisible = false
      },
      handleDetailDisplay () {
        lx.mc({ bid: 'b_shangou_online_e_ctw618b9_mc' })
        this.$router.replace({ name: 'spDetail', query: { ...this.$route.query, spId: this.productData.id } })
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
