<template>
  <Poptip
    placement="bottom-start"
    class="input-style-poptip"
    @on-popper-show="popTipVisible = true"
    @on-popper-hide="popTipVisible = false"
  >
    <FakeInput
      placeholder="请选择商品"
      :active="popTipVisible"
    >

    </FakeInput>
    <MultiCascadeRemote
      slot="content"
      show-all
      :data-source="tagList"
      :getData="fetchData"
      @change="handleChange"
    />
  </Poptip>
</template>

<script>
  import { MultiCascadeRemote } from '@/components/multi-cascade'
  import { fetchGetProductList } from '@/data/repos/merchantProduct'
  import FakeInput from './fake-input'

  export default {
    name: 'ProductSelector',
    components: {
      MultiCascadeRemote,
      FakeInput
    },
    props: {
      tagList: Array,
      fetchProductList: {
        type: Function,
        default: fetchGetProductList
      }
    },
    data () {
      return {
        popTipVisible: false,
        selectedTree: null
      }
    },
    computed: {
      displayStatisticInfo () {
        if (this.selectedTree) {}
        return null
      }
    },
    methods: {
      async fetchData (tagIdPath, pagination) {
        const tagId = tagIdPath.slice(-1)[0]
        const result = await this.fetchProductList({ tagId }, pagination)
        return result
      },
      handleChange (selectedTree) {
        console.log(selectedTree)
      }
    }
  }
</script>

<style scoped lang="less">
  .input-style-poptip {
    ///deep/ .boo-poptip-rel {
    //  padding: 3px;
    //}
    /deep/ .boo-poptip-popper {
      padding: 0;
    }
    /deep/ .boo-poptip-body {
      padding: 0;
    }
    /deep/ .boo-poptip-arrow {
      display: none;
    }
  }
</style>
