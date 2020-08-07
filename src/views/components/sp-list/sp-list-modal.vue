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
    ref="modal"
  >
    <SpList
      :showTopSale="showTopSale"
      v-onlyone="value"
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
  import { isFunction } from 'lodash'

  export default {
    name: 'sp-list-modal',
    components: { SpList: withOnlyone(SpList) },
    mixins: [layerTableResizeMixin],
    directives: { onlyone },
    props: {
      value: Boolean,
      showTopSale: Boolean,
      userInput: String
    },
    watch: {
      value (v) {
        this.tableResize(v)
        this.$emit(v ? 'start' : 'end')
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
        const $modal = this.$refs.modal && this.$refs.modal.$refs.modal
        if ($modal && isFunction($modal.removeScrollEffect)) {
          setTimeout(() => $modal.removeScrollEffect(), 500)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .sp-list-modal {
    /deep/ .boo-modal-body {
      padding: 20px;
    }
  }
</style>
