<template>
  <div class="nav-actions">
    <span v-if="isCorrect" @click="handleCorrectVisible">标品纠错 ></span>
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
        // return this.productData.recoverySymbol === '1' && this.allowCorrectSp
        return this.allowCorrectSp
      }
    },
    methods: {
      handleCorrectVisible () {
        this.isCorrectVisible = true
      },
      handleCorrectConfirm () {
        this.isCorrectVisible = false
        this.$router.replace({ name: 'spCorrect', query: { ...this.$route.query, spId: this.productData.spId } })
      },
      handleCorrectCancel () {
        this.isCorrectVisible = false
      }
    }
  }
</script>
<style lang="less" scoped>
  .nav-actions {
    display: flex;
    flex-direction: column;
    position: fixed;
    color: @link-color;
    top: 15px;
    right: 20px;
    z-index: 1000;
    > span {
      &:not(:last-child) {
        margin-right: 10px;
      }
      cursor: pointer;
    }
  }
</style>
