<template>
  <Modal
    class="sp-list-modal"
    :value="value"
    title="商品库"
    footer-hide
    width="80%"
    :styles="{ minWidth: '750px', maxWidth: '1000px' }"
    @input="handleInput"
    @on-hidden="handleHidden"
  >
    <SpList
      :showTopSale="showTopSale"
      v-onlyone="value"
      :defaultSelectedTab="defaultSelectedTab"
      :outsideMode="outsideMode"
      :searchWords="searchText"
      modal
      @on-select-product="triggerSelectProduct"
    />
  </Modal>
</template>

<script>
  import withOnlyone from '@/hoc/withOnlyone'
  import onlyone from '@/directives/onlyone'
  import SpList from '@/views/components/sp-list'
  import layerTableResizeMixin from '@/mixins/layerTableResize'

  export default {
    name: 'sp-list-modal',
    components: { SpList: withOnlyone(SpList) },
    mixins: [layerTableResizeMixin],
    directives: { onlyone },
    props: {
      value: Boolean,
      showTopSale: Boolean,
      userInput: String,
      defaultSelectedTab: String,
      // 搜索的位置，是否为在列表外部控制搜索
      outsideMode: {
        type: Boolean,
        default: () => false
      }
    },
    data () {
      return {
        searchText: this.userInput
      }
    },
    watch: {
      value (v) {
        this.tableResize(v)
        this.$emit(v ? 'start' : 'end')
        if (v) {
          this.searchText = this.userInput
        }
      },
      userInput () {
        if (this.value) {
          this.searchText = this.userInput
        }
      }
    },
    methods: {
      handleInput (v) {
        this.$emit('input', v)
      },
      triggerSelectProduct (v) {
        this.$emit('on-select-product', v)
      },
      handleHidden () {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }
</script>

<style lang="less" scoped>
  .sp-list-modal {
    /deep/ .boo-modal-body {
      padding: 20px 20px 0;
    }
    /deep/ .footer {
      padding: 14px 0;
    }
  }
</style>
